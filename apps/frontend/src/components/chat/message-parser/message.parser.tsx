export interface MessageParserProps {
  text: string;
}

export function MessageParser({ text }: MessageParserProps) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}
