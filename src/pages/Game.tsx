export default function Game({ room }: { room: string }) {
  return (
    <>
      <title>对战 - {room}</title>
      {room}
    </>
  );
}
