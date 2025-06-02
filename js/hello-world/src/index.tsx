import React from "react";
import Reatkact from "reatkact";

function HelloWorld() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <>
      <atkText
        x={10}
        y={40}
        font="Jupiter"
        fontSize={24}
      >
        Hello, Dalamud!
      </atkText>

      <atkText
        x={10}
        y={70}
      >
        The current time is {time.toString()}
      </atkText>

      <atkTextButton
        x={10}
        y={90}
        width={150}
      >
        Why does this exist
      </atkTextButton>
    </>
  );
}

export default Reatkact.run(
  <HelloWorld />,
  {
    title: "Hello World",
    width: 600,
    height: 300
  }
);
