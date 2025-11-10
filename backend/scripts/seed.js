import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.playlistSong.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.artist.deleteMany();

  const arijit = await prisma.artist.create({ data: { name: 'Arijit Singh', genre: 'Bollywood', country: 'India' } });
  const ed = await prisma.artist.create({ data: { name: 'Ed Sheeran', genre: 'Pop', country: 'UK' } });
  const weeknd = await prisma.artist.create({ data: { name: 'The Weeknd', genre: 'R&B', country: 'Canada' } });

  const s1 = await prisma.song.create({ data: { title: 'Tum Hi Ho', duration: 235, artistId: arijit.id } });
  const s2 = await prisma.song.create({ data: { title: 'Shape of You', duration: 252, artistId: ed.id } });
  const s3 = await prisma.song.create({ data: { title: 'Blinding Lights', duration: 200, artistId: weeknd.id } });
  const s4 = await prisma.song.create({ data: { title: 'Kesariya', duration: 268, artistId: arijit.id } });

  const p1 = await prisma.playlist.create({ data: { name: 'My Favorites', user: 'Guest' } });
  await prisma.playlistSong.createMany({ data: [
    { playlistId: p1.id, songId: s1.id },
    { playlistId: p1.id, songId: s2.id },
  ]});
}

main().then(()=>process.exit(0)).catch((e)=>{ console.error(e); process.exit(1); });




