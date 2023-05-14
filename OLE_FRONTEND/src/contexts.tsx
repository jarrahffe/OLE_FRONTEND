import React from 'react'

type ClickContext = {
  clicked: string
  setClicked: React.Dispatch<React.SetStateAction<string>>
}

export const ClickContext = React.createContext({} as ClickContext);
