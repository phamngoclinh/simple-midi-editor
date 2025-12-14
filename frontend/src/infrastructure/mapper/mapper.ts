import { Note } from "../../domain/entities/Note";
import { Song } from "../../domain/entities/Song";
import { Track } from "../../domain/entities/Track";
import { Note as NoteResponse, Song as SongResponse, Track as TrackResponse } from "../types/api";

export const SongMapper = {
  toDomain(response: SongResponse): Song {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      totalDuration: response.totalDuration,
      tags: response.tags,
      tracks: response.tracks.map(track => ({
        id: track.id,
        songId: response.id,
        order: track.order,
        label: track.label,
        instrument: track.instrument,
        notes: track.notes?.map(note => ({
          id: note.id,
          songId: response.id,
          trackId: track.id,
          track: track.order,
          time: note.time,
          title: note.title,
          description: note.description,
          color: note.color,
          icon: note.icon
        })) || []
      })),
      createdTimestamp: response.createdTimestamp,
      updatedTimestamp: response.updatedTimestamp
    }
  }
}

export const TrackMapper = {
  toDomain(response: TrackResponse): Track {
    return {
      id: response.id,
      order: response.order,
      label: response.label,
      instrument: response.instrument,
      notes: response.notes?.map(NoteMapper.toDomain) || []
    }
  }
}

export const NoteMapper = {
  toDomain(response: NoteResponse): Note {
    return {
      id: response.id,
      trackId: response.track.id,
      track: response.track.order,
      time: response.time,
      title: response.title,
      description: response.description,
      color: response.color,
      icon: response.icon
    }
  }
}