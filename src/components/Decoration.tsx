type DecorationProps = {
  color: string;
  isOn: boolean;
  children: React.ReactNode;
};

const Decoration = ({ color, isOn, children }: DecorationProps) => {
  return (
    <div className="" style={{ color: color }}>
      {children}
    </div>
  );
};

export default Decoration;
