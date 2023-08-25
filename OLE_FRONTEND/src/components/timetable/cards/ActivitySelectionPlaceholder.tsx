import React from 'react'
import { ClickContext, UserInfoContext } from '../../../contexts';
import { animated, useSpring } from '@react-spring/web';

type Props = {
  name: string
}

const ActivitySelectionPlaceholder = (props: Props) => {

  // clicked = Grid cell currently clicked variable (string)
  // setClicked = Function to set currently clicked grid cell
  const { clicked, setClicked } = React.useContext(ClickContext);

  const [springs, api] = useSpring(() => ({
    from: {
      backgroundColor: "#eceff1",
      opacity: "0%"
    }
  }));

  React.useEffect(() => {
    api.start({
      from: {
        opacity: "0%"
      },
      to: {
        opacity: "100%"
      }
    });
  }, [])

  return (

    <animated.div
      onClick={() => setClicked("")}
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        outline: "grey solid 0.5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "rgb(37,52,69)",
        zIndex: 4,
        ...springs
      }}>

      <div className='grid-cell-name'>
        <p>{props.name}</p>
      </div>

    </animated.div>
  )
}

export default ActivitySelectionPlaceholder
