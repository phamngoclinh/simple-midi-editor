import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef
} from 'react';

export interface ResizableColumn {
  id: string;      // ID duy nhất (uuid)
  order: number;   // Thứ tự sắp xếp (0, 1, 2, ...)
  label: string;   // Tên cột
  width: number;   // Chiều rộng hiện tại
  minWidth: number;
  maxWidth: number;
}

interface ResizableContextType {
  columns: ResizableColumn[];

  // Hàm xử lý bắt đầu kéo, nhận ID của cột cần resize
  handleColumnResizeStart: (e: React.MouseEvent, columnId: string) => void;

  initializeColumns: (initialConfigs: {
    id: string,
    label: string;
    width: number;
    minWidth: number;
    maxWidth: number;
  }[]) => void;
}

// ... (Khai báo Context và useResizableContext Hook giữ nguyên)
const ResizableContext = createContext<ResizableContextType | undefined>(undefined);

export const useResizableContext = () => {
  const context = useContext(ResizableContext);
  if (context === undefined) {
    throw new Error('useResizableContext must be used within a ResizableProvider');
  }
  return context;
};

/**
 * Khởi tạo danh sách cột với chiều rộng mặc định và thứ tự dựa trên vị trí mảng.
 */
const createInitialColumns = (configs: {
  id: string,
  label: string,
  width: number;
  minWidth: number;
  maxWidth: number;
}[]): ResizableColumn[] => {
  return configs.map((config, index) => ({
    id: config.id,
    label: config.label,
    order: index, // Thứ tự dựa trên vị trí ban đầu
    width: config.width, // Áp dụng chiều rộng mặc định
    minWidth: config.minWidth,
    maxWidth: config.maxWidth
  }));
};

// --- 3. Component Provider (Cập nhật Logic) ---
interface ResizableProviderProps {
  children: React.ReactNode;
}

export const ResizableProvider: React.FC<ResizableProviderProps> = ({ children }) => {

  // State quản lý chiều rộng của TẤT CẢ các cột có thể resize
  const [columns, setColumns] = useState<ResizableColumn[]>([]);

  // State theo dõi cột đang được kéo và trạng thái kéo
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Refs lưu vị trí/kích thước ban đầu
  const startXRef = useRef(0);
  const startWidthRef = useRef(0); // Chiều rộng của cột đang kéo
  // const nextWidthRef = useRef(0); // Chiều rộng của cột lân cận (nếu có)

  const initializeColumns = useCallback((initialConfigs: { id: string, label: string, width: number; minWidth: number; maxWidth: number; }[]) => {
    setColumns(createInitialColumns(initialConfigs));
  }, []);

  // --- Logic Resize Chiều rộng (Width) ---

  // Xử lý bắt đầu kéo
  const handleColumnResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
    const activeColumn = columns.find(c => c.id === columnId);
    if (!activeColumn) return;

    setIsResizing(true);
    setActiveColumnId(columnId);
    startXRef.current = e.clientX;
    startWidthRef.current = activeColumn.width;
    e.preventDefault();
  }, [columns]); // Dependency: Cần columns để lấy width ban đầu

  // Xử lý di chuyển chuột
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !activeColumnId) return;

    const deltaX = e.clientX - startXRef.current;
    let newWidth = startWidthRef.current + deltaX;

    // 💥 Cập nhật chiều rộng của cột đang hoạt động
    setColumns(prev =>
      prev.map(c => {
        // Giới hạn chiều rộng
        newWidth = Math.max(c.minWidth, newWidth);
        newWidth = Math.min(c.maxWidth, newWidth);
        return c.id === activeColumnId
          ? { ...c, width: newWidth }
          : c
      }).sort((a, b) => a.order - b.order) // Đảm bảo thứ tự render luôn đúng
    );

  }, [isResizing, activeColumnId]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setActiveColumnId(null);
  }, []);

  // --- useEffect: Quản lý Global Event Listeners (Giữ nguyên) ---
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Giá trị được cung cấp cho Context
  const contextValue: ResizableContextType = {
    columns: columns.sort((a, b) => a.order - b.order), // 💥 Luôn trả về mảng đã sắp xếp
    handleColumnResizeStart,
    initializeColumns, // 💥 Thêm hàm khởi tạo vào Context
  };

  return (
    <ResizableContext.Provider value={contextValue}>
      {children}
      {isResizing && <div style={resizingOverlayStyle} />}
    </ResizableContext.Provider>
  );
};

// Style cho Overlay
const resizingOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  cursor: 'col-resize',
};