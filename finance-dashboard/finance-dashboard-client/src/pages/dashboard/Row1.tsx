import DashBoardBox from "@/components/DashBoardBox";
import { useGetKpisQuery } from "@/store/api";

const Row1 = () => {
  const { data } = useGetKpisQuery();
  return (
    <>
      <DashBoardBox gridArea="a" bgcolor="#fff"></DashBoardBox>
      <DashBoardBox gridArea="b" bgcolor="#fff"></DashBoardBox>
      <DashBoardBox gridArea="c" bgcolor="#fff"></DashBoardBox>
    </>
  );
};

export default Row1;
