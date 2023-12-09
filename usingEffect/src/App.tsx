import { useState, useEffect } from 'react'
import './App.css'

interface IMonster {
  name: string,
  url: string,
  image?: string
}
function App() {
  const [monster, setMonster] = useState<IMonster>({ name: 'adult-black-dragon', url: '', image: 'https://www.dnd5eapi.co/api/images/monsters/adult-black-dragon.png' })
  const [monsters, setMonsters] = useState<IMonster[]>([])
  const [showButtons, setShowButtons] = useState(true)
  const [background, setBackground] = useState<string>('select a monster')
  
  useEffect(() => {
    setBackground(monster.name)
  }, [monster.name])

  useEffect(() => {
    fetchMonster()
    setBackground('select a monster')
  }, [])


  const fetchMonster = async () => {
    const resp = await fetch(`https://www.dnd5eapi.co/api/monsters/`)
    const data = await resp.json();
    
    for (const mon of data.results) {
      const url = `https://www.dnd5eapi.co${mon.url}`;
      const respMonster = await fetch(url);
      const dataMonster = await respMonster.json();
      if (dataMonster.image) {
        setMonsters(prevMonsters => [
          ...prevMonsters, 
          { name: dataMonster.name, url: dataMonster.url, image: dataMonster.image }
        ]);
        
      }
    }
    console.log(monsters)

  }


  const handleClick = async (mons: IMonster) => {
    const urlPre = 'https://www.dnd5eapi.co'
    const url = urlPre + mons.url
    const resp = await fetch(url)
    const data = await resp.json()
    console.log(data);
    setMonster({ name: data.name, url: data.url })
    if (data.image) {
      console.log(data.image);
      const newImage = urlPre + data.image
      console.log(newImage);
      setMonster({ name: data.name, url: data.url, image: newImage })
    }
    setShowButtons(false)
  }

  const handleButton = () => {
    setShowButtons(true)
    setBackground('select a monster')
  }

  return (
    <>
      <div className='mainDiv'>
            <div className='scrollDiv'>
        <h4 className='backgroundScroller'>{background}</h4>
              </div>
        {showButtons && (
          <div className='inputDiv'>
            <h2 className='firstTitle'>
              Select a mythical creature:
            </h2>
            <div className='allMonsters'>
              {monsters.map((mons, key) => {
                return <button
                  className='monsterBtn'
                  key={key}
                  onClick={() => handleClick(mons)}>{mons.name}</button>
              })}
            </div>
          </div>
        )}

        <div className='card'>
          <h3 className="monsterName">{monster.name}</h3>
          <button
          onClick={() => handleButton()}>Try Another</button>
          {monster.image ? <img className='monsterImg' src={monster.image}></img>
          : <h3>Sorry, no image for this one</h3>
          }
        </div>
      </div>
    </>
  )
}

export default App
