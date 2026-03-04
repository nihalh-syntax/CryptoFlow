type StatusProps = {
  message: string;
};

export default function Status({ message }: StatusProps) {
  return (
    <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
      {message}
    </div>
  );
}