import RittyImg from "../assets/rittyImg.png";

function Header() {
  return (
    <div className="bg-white w-full h-fit border-b-[1px] px-[30px] py-[15px] flex items-center gap-[15px] text-[22px] font-bold">
      <img src={RittyImg} width={55} height={55} />
      리티
    </div>
  );
}

export default Header;
