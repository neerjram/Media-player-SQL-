import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 4000;
const origin = process.env.ORIGIN || '*';

app.use(cors({ origin }));
app.use(express.json());

const toSongDTO = (s) => ({
  id: s.id,
  title: s.title,
  artist: s.artist?.name ?? s.artistName ?? 'Unknown',
  duration: s.duration,
  plays: s.plays,
  likes: s.likes,
});

app.get('/songs/new', async (req, res) => {
  const songs = await prisma.song.findMany({
    orderBy: { id: 'desc' },
    include: { artist: true },
    take: 20,
  });
  res.json(songs.map(toSongDTO));
});

app.get('/artists', async (req, res) => {
  const artists = await prisma.artist.findMany({ orderBy: { name: 'asc' } });
  res.json(artists);
});

app.post('/artists', async (req, res) => {
  const { name, genre, country } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const artist = await prisma.artist.create({ data: { name, genre, country } });
  res.status(201).json(artist);
});

app.post('/songs', async (req, res) => {
  const { title, artist, duration } = req.body;
  if (!title || !artist || !duration) return res.status(400).json({ error: 'title, artist, duration required' });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const artistRow = await tx.artist.upsert({
        where: { name: artist },
        update: {},
        create: { name: artist },
      });
      const song = await tx.song.create({ data: { title, duration: Number(duration), artistId: artistRow.id } });
      return toSongDTO({ ...song, artist: artistRow });
    });
    res.status(201).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to create song' });
  }
});

app.put('/songs/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, artist, duration } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      let artistRow = undefined;
      if (artist) {
        artistRow = await tx.artist.upsert({
          where: { name: artist },
          update: {},
          create: { name: artist },
        });
      }
      const song = await tx.song.update({
        where: { id },
        data: {
          ...(title ? { title } : {}),
          ...(duration ? { duration: Number(duration) } : {}),
          ...(artistRow ? { artistId: artistRow.id } : {}),
        },
        include: { artist: true },
      });
      return toSongDTO(song);
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to update song' });
  }
});

app.delete('/songs/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.playlistSong.deleteMany({ where: { songId: id } });
      await tx.song.delete({ where: { id } });
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to delete song' });
  }
});

app.get('/playlists', async (req, res) => {
  const lists = await prisma.playlist.findMany({ orderBy: { id: 'desc' } });
  res.json(lists);
});

app.post('/playlists', async (req, res) => {
  const { name, user } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const p = await prisma.playlist.create({ data: { name, user: user || 'Guest' } });
  res.status(201).json(p);
});

app.get('/playlists/:id', async (req, res) => {
  const id = Number(req.params.id);
  const p = await prisma.playlist.findUnique({ where: { id }, include: { songs: { include: { song: { include: { artist: true } } } } } });
  if (!p) return res.status(404).json({ error: 'not found' });
  const songs = p.songs.map(ps => toSongDTO({ ...ps.song }));
  res.json({ id: p.id, name: p.name, user: p.user, songs });
});

app.post('/playlists/:id/songs', async (req, res) => {
  const id = Number(req.params.id);
  const { songId } = req.body;
  try {
    await prisma.$transaction(async (tx) => {
      // verify existence to ensure FK integrity under transaction
      await tx.playlist.findUniqueOrThrow({ where: { id } });
      await tx.song.findUniqueOrThrow({ where: { id: Number(songId) } });
      await tx.playlistSong.create({ data: { playlistId: id, songId: Number(songId) } });
    });
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to add song to playlist' });
  }
});

app.delete('/playlists/:id/songs/:songId', async (req, res) => {
  const id = Number(req.params.id);
  const songId = Number(req.params.songId);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.playlistSong.delete({ where: { playlistId_songId: { playlistId: id, songId } } });
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to remove song from playlist' });
  }
});

app.put('/artists/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, genre, country } = req.body;
  try {
    const artist = await prisma.artist.update({
      where: { id },
      data: { ...(name ? { name } : {}), genre, country },
    });
    res.json(artist);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to update artist' });
  }
});

app.delete('/artists/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.$transaction(async (tx) => {
      const songs = await tx.song.findMany({ where: { artistId: id } });
      const songIds = songs.map(s => s.id);
      if (songIds.length) {
        await tx.playlistSong.deleteMany({ where: { songId: { in: songIds } } });
        await tx.song.deleteMany({ where: { id: { in: songIds } } });
      }
      await tx.artist.delete({ where: { id } });
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to delete artist' });
  }
});

app.get('/search', async (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const songs = await prisma.song.findMany({ include: { artist: true } });
  const artists = await prisma.artist.findMany();
  const songsOut = songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.name.toLowerCase().includes(q)).map(toSongDTO);
  const artistsOut = artists.filter(a => a.name.toLowerCase().includes(q));
  res.json({ songs: songsOut, artists: artistsOut });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});




