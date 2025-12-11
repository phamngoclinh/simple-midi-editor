import { INoteRepository } from '../../domain/repositories/INoteRepository';

/**
 * Lớp Use Case: Xóa một Note cụ thể khỏi Song.
 */
export class DeleteExistingNote {
  private noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  /**
   * Thực thi Use Case.
   * @param noteId ID của Note cần xóa.
   * @param songId ID của Song chứa Note đó.
   * @returns Promise<void>.
   */
  async execute(noteId: string, songId: string, trackId: string): Promise<void> {
    await this.noteRepository.deleteById(noteId, songId);
  }
}