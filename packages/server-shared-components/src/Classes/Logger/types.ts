export type FileOptionsType = {
  fileName?: string | (() => string);
  path?: string | (() => string);
  maxSizeKb?: number;
  clearIfExists?: boolean;
  addStartTimeToFileName?: boolean;
  addEndTimeToFileName?: boolean; // для случаев, когда есть максимальный размер файла
  dateGenerator?: (time: Date) => string;
  fileExtension?: string;
};

export type LoggerOptionsType = {
  dateGenerator?: (time: Date) => string;
  mode?: 'development' | 'production';
  fileOptions?: FileOptionsType;
};