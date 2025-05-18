export const Polaroid: React.FC<{ suspect: any }> = ({ suspect }) => {
  return (
    <div className="bg-white p-5 text-center w-42 max-w-42 max-h-52 shadow grayscale polaroid">
      <div className="relative w-32 h-32  overflow-hidden border-1 border-black">
        <img
          src="/images/gameBoy/walls.png"
          className="w-32 h-32  absolute"
        ></img>
        <img
          src={suspect.mugshot}
          className="w-32 h-32 object-contain absolute"
        />
      </div>
      <p className="font-bold text-black h-full ">{suspect.name}</p>
    </div>
  )
}

export const CasePolaroid: React.FC<{ imgUrl: string }> = ({ imgUrl }) => {
  return (
    <div className="bg-white p-5 text-center w-42 shadow grayscale polaroid">
      <div className="relative w-32 h-32 overflow-hidden border-1 bg-notebook-darker border-black">
        <img src={imgUrl} className="w-32 h-32 object-contain absolute" />
      </div>
      <p className="font-bold text-black">Crime Scene</p>
    </div>
  )
}
