import { exportSongUseCase, importSongUseCase } from '../../../dependencies';
import { useStudioDispatch } from '../../../infrastructure/stores/studio';
import { storeSongMapper } from '../store/mapper';
import useModalAction from '../store/useModalAction';
import { z } from 'zod';

const SongDocumentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  
  description: z.string().optional(),
  
  totalDuration: z.number().nonnegative(),
  
  trackLabels: z.array(z.string()),
  
  notes: z.array(
    z.object({
      track: z.number().int(),
      time: z.number(),
      title: z.string(),
      description: z.string().optional(),
      color: z.string(),
      icon: z.string().optional(),
    })
  ),
  
  tags: z.array(z.string())
});

type SongDocument = z.infer<typeof SongDocumentSchema>;

const useImportExportSong = () => {
  const dispatch = useStudioDispatch();
  const { showToast } = useModalAction();

  const importSong = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const jsonString = ev.target?.result;
        try {
          const rawData = JSON.parse(jsonString as string);
          const result = SongDocumentSchema.safeParse(rawData);
          if (!result.success) {
            showToast({
              type: 'error',
              message: 'Import Song thất bại',
              extraMessage: 'Nội dung tập tin không hợp lệ'
            });
            return;
          }
          const songDocument: SongDocument = result.data;
          const createdSong = await importSongUseCase.execute(songDocument);
          if (!createdSong.success) {
            showToast({
              type: 'error',
              message: 'Import Song thất bại',
              extraMessage: createdSong.message,
            });
            return;
          }
          showToast({
            type: 'success',
            message: `Đã import và tạo Song mới: '${createdSong.data.name}'`,
          });
          dispatch({ type: 'CREATE_SONG', payload: storeSongMapper.toSongChangePayload(createdSong.data) })
        } catch (err: any) {
          console.error('Lỗi khi import Song:', err);
          showToast({
            type: 'error',
            message: 'Import Song thất bại',
            extraMessage: err?.message
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportSong = async (songId: string) => {
    try {
      const response = await exportSongUseCase.execute(songId);
      if (!response.success) {
        showToast({
          type: 'error',
          message: 'Export Song thất bại',
          extraMessage: response.message
        });
        return;
      }
      const jsonString = JSON.stringify(response.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${response.data.name.replace(/\s/g, '_')}_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast({
        type: 'success',
        message: `Đã export Song '${response.data.name}' thành công.`,
      });
    } catch (err: any) {
      console.error('Lỗi khi export Song:', err);
      showToast({
        type: 'error',
        message: 'Export Song thất bại',
        extraMessage: err?.message
      });
    }
  };

  return {
    importSong,
    exportSong
  };
}

export default useImportExportSong;