import { Card } from "../components/Card";
import Navbar from "../components/NavBar";
const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card
          cardId={"261df03a-22b5-48e5-9080-015a2e5895d1"}
          title="UI Showdown"
          description="Showcase your front-end skills in a challenge to design the most stunning and functional user interfaces using HTML, CSS, and JS!"
          image="/UIShowdown.png"
        />
        <Card
          cardId={"32e25736-e688-4829-a33f-72053ba8ac26"}
          title="Bug Busters"
          description="Test your debugging skills in this fast-paced challenge where you'll race against time to find and fix bugs in the code. The quicker you fix, the higher you score!"
          image="/BugBuster.png"
        />
        <Card
          cardId={"f32a4b61-a527-44b7-97dc-5d807a31b130"}
          title="Pixel Perfection"
          description="Unleash your creativity and design the perfect logo that speaks volumes. Let your imagination shape brands, one pixel at a time!"
          image="/PixelPerfection.png"
        />
        <Card
          cardId={"305d227b-5ab0-457a-b0e4-d727c85ac7ad"}
          title="Code in the Dark"
          description="Prove your coding prowess by writing code in complete darkness. The twist? You can’t see your screen, only your skills will guide you!"
          image="/BlindCode.png"
        />
        <Card
          cardId={"cb06bf49-f8d1-4281-8b2d-079e1447703b"}
          title="Guess it Right!"
          description="A fun, high-energy game where one partner holds a card with a word or phrase, and the other acts it out without speaking. Guess correctly before time runs out to win!"
          image="/HeadsUp.png"
        />
        <Card
          cardId={"8ab839a5-0b6a-4791-9742-d099677d5062"}
          title="BGMI TDM Showdown"
          description="Step into the gaming arena and battle your way to victory! Compete in a thrilling multiplayer experience and show off your strategic skills."
          image="/BGMI.png"
        />
        <Card
          cardId={"cc71840b-59cf-4e85-8e80-e42dd4e7d55a"}
          title="Brand Hunt"
          description="Hunt for clues and solve branding-related challenges in this treasure hunt-style event. Identify the right brands, solve clues, and claim your victory!"
          image="/BrandHunt.png"
        />
        <Card
          cardId={"6cdd1ecb-af3b-4045-b183-6646e07a3c1e"}
          title="Clash of Thoughts"
          description="Engage in a thought-provoking debate where your perspective will be put to the test. Speak confidently and win the battle of minds!"
          image="/Debate.png"
        />
        <Card
          cardId={"019789e7-7a8a-488c-b145-c4c217387d2b"}
          title="Brain Battle"
          description="Test your cognitive abilities with brain teasers and challenges that require both speed and intelligence. Solve, strategize, and conquer!"
          image="/Quiz.png"
        />
      </div>
    </>
  );
};

export default Landing;
