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
        position={{ x: 10, y: 40 }}
        font="Jupiter"
        fontSize={24}
      >
        Hello, Dalamud!
      </atkText>

      <atkText
        position={{ x: 10, y: 70 }}
      >
        The current time is {time.toString()}
      </atkText>

      <atkTextButton
        position={{ x: 10, y: 90 }}
        size={{ x: 150, y: 28 }}
      >
        Why does this exist
      </atkTextButton>
    </>
  );
}

export default function run() {
  try {
    const container = Reatkact.createContainer({
      title: "Hello World",
      size: { x: 600, y: 300 }
    });
    const root = Reatkact.createRoot(container);
    const unmount = root.render(<HelloWorld />);
    return () => {
      // without this the game will deadlock GCing lol
      unmount();
    };
  } catch (e) {
    // just for debugging react issues
    console.error(e);
  }
}
