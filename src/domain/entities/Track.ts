// src/domain/entities/Track.ts

import { Note } from './Note'; // Cần import Entity Note

/**
 * Thể hiện một kênh nhạc (instrument/channel) trong Song.
 */
export interface Track {
    /** ID duy nhất của Track (có thể là một số thứ tự: 1, 2, 3...). */
    id?: string;

    songId?: string;

    order: number;

    /** Tên của Track (ví dụ: "Piano", "Drums", "Bass"). */
    label: string;

    /** Kênh MIDI (từ 1 đến 16). */
    // midiChannel: number;

    /** Tên nhạc cụ hoặc số hiệu (General MIDI number). */
    instrument: string;

    /** Tập hợp các nốt (Notes) thuộc về Track này. */
    notes: Note[];

    // Có thể bổ sung thêm các thuộc tính khác như Panning, Effects, v.v.
}