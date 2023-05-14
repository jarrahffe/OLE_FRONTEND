import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Activity } from '../../config/activity';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ActivitySelection from './cards/ActivitySelection';
import { ClickContext } from '../../contexts';
import ActivitySelectionPlaceholder from './cards/ActivitySelectionPlaceholder';

type Props = {
  activity?: Activity
  id: string
}

const GridCell = (props: Props) => {
  const map = new Map();
  map.set("lesson", "linear-gradient(to right, rgb(0, 120, 56), rgb(0, 162, 116))");
  map.set("block", "linear-gradient(to right, rgb(150, 0, 0), rgb(130, 0, 0))");
  map.set("special", "linear-gradient(to right, rgb(0, 16, 120), rgb(0, 73, 162))");

  const { clicked, setClicked } = React.useContext(ClickContext);
  const [name, setName] = React.useState("");

  const handleClick = () => {
    if (clicked === props.id) {
      setClicked("");
    }
    else {
      setClicked(props.id);
    }
  }

  return props.activity ?
    (
      <Tippy
        content={<p>{props.activity.notes !== "" ? props.activity.notes : null}</p>}
      >
        <div
          className='grid-cell-blank'
          id={props.activity.id}
        >
          <div className='grid-cell-activity' style={{ backgroundImage: map.get(props.activity.type) }}>
            <div className='grid-cell-name'>
              {props.activity.name !== "Ole" ?
                <p>{props.activity.name}</p> :
                null
              }
            </div>
          </div>
        </div>
      </Tippy>
    ) :
    (
      <div className='grid-cell-blank'>
        <div className='grid-cell-blank' onClick={() => handleClick()} />
        {
          clicked === props.id ?
            <ActivitySelection name={name} setName={setName} />
            :
            null
        }
        {
          clicked === props.id ?
            <ActivitySelectionPlaceholder name={name} />
            :
            null
        }
      </div>
    )
}

export default GridCell;
