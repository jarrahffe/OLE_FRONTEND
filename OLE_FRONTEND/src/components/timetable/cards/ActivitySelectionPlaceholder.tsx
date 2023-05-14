import React from 'react'
import { animated, useSpring } from '@react-spring/web';

type Props = {
  name: string
}

const ActivitySelectionPlaceholder = (props: Props) => {
  const [springs, api] = useSpring(() => ({
    from: {
      backgroundImage: "linear-gradient(90deg, #FFFFFF -77.97%, #C1C1C1 258.37%)",
      width: "0%",
    }
  }));

  React.useEffect(() => {
    api.start({
      from: {
        width: "0%",
        backgroundImage: "linear-gradient(90deg, #000000 -77.97%, #646464 258.37%)"
      },
      to: {
        width: "95%",
        backgroundImage: "linear-gradient(90deg, #FFFFFF -77.97%, #C1C1C1 258.37%)",
      }
    });
  }, [])

  return (
    <animated.div
      style={{
        position: "absolute",
        height: "80%",
        outline: "grey solid 0.5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "black",
        borderRadius: "20px",
        ...springs
      }}>

      <div className='grid-cell-name'>
        <p>{props.name}</p>
      </div>
    </animated.div>
  )
}

export default ActivitySelectionPlaceholder
