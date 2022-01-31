import React, { Component } from "react";
import MemberCard from "../../components/member-card/MemberCard.jsx";
import { Link } from "react-router";
import { Container, Row, Col } from "react-grid-system";

class Credits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      heads: [],
    };
    this.bindFunction = this.bindFunction.bind(this);
  }

  componentDidMount() {
    this.bindFunction();
  }

  bindFunction() {
    const headsDetails = [
      {
        name: "Dr. Joshua Miele",
        designation: "YouDescribe Creator ",
        tenure: "2013 - Present",
        img: "Josh.jpeg",
        description:
          "Photo of Josh Miele, a white man with curly brown hair. He has a blue left eye and scars covering his face and right eye. He is smiling at the camera and wearing a blue sweater. He is outside with greenery in the background.",
      },
      {
        name: "Charity Pitcher-Cooper",
        designation: "Product Manager ",
        tenure: "2017 - Present",
        img: "Charity.jpg",
        description:
          "Photo of Charity Pitcher-Cooper, a light skinned woman with long brown hair with heavy bangs smiles warmly from her home office. She wears a headset with a microphone, and her chin rests casually on her hand.",
      },
    ];
    const sortedDetails = [
      {
        name: "Rupal Khilari",
        designation: "iOS App ",
        tenure: "2016 - 2017",
        img: "rupal.png",
        description:
          "Photo of Rupal Khilari, a light skinned woman with brown hair. She is smiling at the camera. there is a lake and greenery in the background.",
      },
      {
        name: "Andrew Taylor Scott",
        designation: "Machine Learning ",
        tenure: "2019 - Present",
        img: "andrew.jpg",
        description:
          "Photo of Andrew Taylor Scott, a white man with a beard and his hair is tied behiend his head. He is smiling at the camera. there are some trees in the background.",
      },
      {
        name: "Abhishek Das",
        designation: "Machine Learning ",
        tenure: " 2018 - 2020",
        img: "abhishek.png",
        description:
          "Photo of abhishek das, a brown man with black hair. He is wearing spectacles and smiling at the camera. there are some green mountains in the background.",
      },
      {
        name: "Yash Kant",
        designation: "Machine Learning ",
        tenure: "2018 - 2020",
        img: "yash.png",
        description:
          "Photo os Yash Kant, a brown man with black hair and light stubble. He is smiling brightly towards tha camera. He is also wearing glasses.",
      },
      {
        name: "Umang Mathur",
        designation: "YouDescribeX ",
        tenure: "2018 - 2020",
        img: "umang.jpg",
        description:
          "Photo of Umang Mathur, a brown man with short black hair. He is smiling at the camera with some cars parked in the background. this hands are tucked in his pockets.",
      },
      {
        name: "Beste Yuksel",
        designation: " YouDescribeX Interface ",
        tenure: "2018 - 2020",
        img: "Beste.jpg",
        description:
          "Photo of Beste Yuksel, a fair skineed woman with black-brown long wavy hair. She has glasses on and is smiling at the camera.",
      },
      {
        name: "Ilmi Yoon",
        designation: " Machine Learning & YouDescribeX ",
        tenure: "2018 - Present",
        img: "ilmi.jpg",
        description:
          "Photo os Ilmi Yoon, an asian woman with fair skin and with long wavy brown hair. She is smiling brightly at the camera.",
      },

      {
        name: "Jianfei",
        designation: "YouDescribeX & YouDescribe admin ",
        tenure: "2018 - 2020",
        img: "noImage.jpg",
        description: "No image available. A silhouette image of a guy",
      },
      {
        name: "Poorva Rathi",
        designation: "YouDescribeX ",
        tenure: "2018 - 2020",
        img: "Poorva.jpg",
        description:
          "Photo of Poorva Rathi, a brown skinned woman with long black hair. She is wearing a white dress and is smiling towards the camera.",
      },
      {
        name: "Vaishali Bisht",
        designation: "YouDescribeX ",
        tenure: "2018 - 2020",
        img: "Vaishali.png",
        description:
          "Photo of Vaishali Bisht, a fair skinned woman with black hair. She is wearing a black dress and is standing on a pier in front of the Sea with Ships in the background",
      },
      {
        name: "Raya Farshad",
        designation: "Image caption rating game ",
        tenure: "2018 - 2020",
        img: "noImage.jpg",
        description: "No image available. A silhouette image of a guy.",
      },
      {
        name: "Jose Castanon",
        designation: "YouDescribe ",
        tenure: "2018 - Present",
        img: "jose.jpg",
        description: "No image available. A silhouette image of a guy.",
      },
      {
        name: "Aditya Bodi",
        designation: "YouDescribeX ",
        tenure: "2018 - 2020",
        img: "aditya.jpg",
        description:
          "Photo of Aditya Bodi, a brown man with short black hair and a short beard. He is wearing a suit and is smiling lightly at the camera.",
      },
      {
        name: "Brenna Tirumalashetty",
        designation: "Image caption rating game ",
        tenure: "2018 - 2020",
        img: "brenna_2.jpg",
        description:
          "Photo of Brenna Tirumalashetty, a fair skinned woman with short blonde hair. she is wearing a white dress and is smilling at the camera.",
      },
      {
        name: "Rodrigo Leme de Mello",
        designation: "YouDescribe ",
        tenure: "2017 - 2020",
        img: "RodrigoLeme.jpeg",
        description:
          " Photo of Rodrigo Leme de Mello. A light-skinned man with a sparse, close-cropped beard crouches on a frozen lake. He wears a grey knit beanie, black jacket, jeans, and grey sneakers.",
      },
      {
        name: "Manish Patil",
        designation: "YouDescribeX ",
        tenure: "2020 - Present",
        img: "manish.jpg",
        description:
          "Photo of Manish Patil, a brown skinned man with black hair and short beard. He is smiling at the camera and standing in front of a building on a street.",
      },
      {
        name: "Varun Sura",
        designation: "YouDescribe iOS ",
        tenure: "2020 - Present",
        img: "Varun.jpg",
        description:
          "Photo of Varun Sura, a fair skinned man with long black hair and light stubble. He is wearing a black suit and is smiling at the camera and holding spectacles in his hands.",
      },
    ];

    sortedDetails.sort((a, b) => (a.name > b.name ? 1 : -1));

    const members = this.state.members.slice();
    for (let i = 0; i < sortedDetails.length; i += 1) {
      const _id = i;
      const data = sortedDetails[i];
      const name = data.name;
      const designation = data.designation;
      const tenure = data.tenure;
      const image = data.img;
      const desc = data.description;
      members.push(
        <Col md="content" sm="content" xs="content">
          <MemberCard
            key={_id}
            img={image}
            desc={desc}
            name={name}
            designation={designation}
            tenure={tenure}
          />
        </Col>
      );
    }
    const heads = this.state.heads.slice();
    for (let i = 0; i < headsDetails.length; i += 1) {
      const _id = i;
      const data = headsDetails[i];
      const name = data.name;
      const designation = data.designation;
      const tenure = data.tenure;
      const image = data.img;
      heads.push(
        <Col md="content" sm="content" xs="content">
          <MemberCard
            key={_id}
            img={image}
            name={name}
            designation={designation}
            tenure={tenure}
          />
        </Col>
      );
    }
    this.setState({ heads });
    this.setState({ members });
  }

  render() {
    let KnowMoreButton = (
      <div className="w3-margin-top w3-center load-more">
        <Link to="/creditsPage" target="_blank" className="footer-links">
          <button>Know More</button>
        </Link>
      </div>
    );
    return (
      <div id="credits">
        <header role="banner" className="w3-container w3-indigo">
          <h2 style={{ textAlign: "center" }}>Credits</h2>
        </header>
        <div id="Meet the team">
          <h1 style={{ textAlign: "center" }}>
            Meet the creative minds behind YouDescribe
          </h1>
        </div>
        <Container>
          <Row justify="center">{this.state.heads}</Row>
        </Container>
        <Container>
          <Row justify="center">{this.state.members}</Row>
        </Container>

        {KnowMoreButton}
      </div>
    );
  }
}

export default Credits;
