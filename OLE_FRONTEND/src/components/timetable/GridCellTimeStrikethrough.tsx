
type Props = {
  irlMinute: number
}

const GridCellTimeIndicator = (props: Props) => {

  return (
    <div style={{position: "absolute", width: "100%", height: "2%", backgroundColor: "red", top: `${props.irlMinute / 60 * 100}%`}}/>
  )
}

export default GridCellTimeIndicator;