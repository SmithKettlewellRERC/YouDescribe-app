import React, { Component } from 'react';
import path from 'path';

class CreditsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details : [],
      projects : [],
      publications : [],
      awards : [],
      favoritecolor:"red"
    };
    this.someFunction = this.someFunction.bind(this);
  }
  componentDidMount(){
    this.someFunction();
  }
  
  someFunction() {
    const name = "Varun";
    
     const obj = [
       { 
       name:"Rupal Khilari",
       bio:"Rupal Khilari is a software developer and an alumni of San Francisco State University. With a keen interest in art and music, she continues to pursue problems that lie at the intersection of art, media and technology.",
       img:"rupal.png",
       pdf:"895Report_Poorva.pdf",
       tenure: "2016 - 2017",
       description: "Photo of Rupal Khilari, a light skinned woman with brown hair. She is smiling at the camera. there is a lake and greenery in the background."
      },
       { 
       name:"Andrew Taylor Scott",
       bio:"Andrew Taylor Scott is currently the Linux HPC Administrator at Blue River Technology. He is interested in computer vision, machine learning, and high performance computing. He has worked in tech in the San Francisco Bay Area since the late 90's and he is currently completing a Masters degree in Computer Science at San Francisco State University. He previously completed a Bachelors degree in Computer Science at San Francisco State University and an Associates degree in Computer Science at City College of San Francisco.",
       img:"andrew.jpg",
       pdf:"895Report_Poorva.pdf",
       tenure: "2019 - Present",
       description: "Photo of Andrew Taylor Scott, a white man with a beard and his hair is tied behiend his head. He is smiling at the camera. there are some trees in the background."
      },
       { 
       name:"Abhishek Das",
       bio:"Abhishek Das is a Research Scientist at Facebook AI Research. He works in AI and is interested in computer vision, language modeling, and reinforcement learning. Previously, he completed his PhD in Computer Science at Georgia Tech, and his Bachelor’s in Electrical Engineering at Indian Institute of Technology Roorkee. Link to my website: https://abhishekdas.com and photo: https://abhishekdas.com/img/cover2.jpg",
       img:"abhishek.png",
       pdf:"895Report_Poorva.pdf",
       tenure: "2018 - 2020",
       description: "Photo of abhishek das, a brown man with black hair. He is wearing spectacles and smiling at the camera. there are some green mountains in the background."
      },
       { 
       name:"Yash Kant",
       bio:"Yash Kant is a Research Visitor at Georgia Tech supervised by Devi Parikh and Dhruv Batra. He works on the intersection of Computer Vision and Natural Language Processing. He completed undergraduate studies from the Indian Institute of Technology Roorkee.  He has interned at Microsoft and the National University of Singapore. Link to my website: http://yashkant.github.io/ and photo: https://yashkant.github.io/images/yashkant.jpg",
       img:"yash.png",
       pdf:"895Report_Poorva.pdf",
       tenure: "2018 - 2020",
       description: "Photo os Yash Kant, a brown man with black hair and light stubble. He is smiling brightly towards tha camera. He is also wearing glasses."
      },
       { 
       name:"Umang Mathur",
       bio:"Umang Mathur completed his Masters degree in Computer Science from San Francisco State University and is currently working in the SF Bay Area as a Software Engineer.",
       img:"umang.jpg",
       pdf:"895Report_Poorva.pdf",
       tenure: "2018 - 2020",
       description: "Photo of Umang Mathur, a brown man with short black hair. He is smiling at the camera with some cars parked in the background. this hands are tucked in his pockets."
      },
       { 
       name:"Beste Yuksel",
       bio:"Beste Filiz Yuksel received her PhD in Computer Science from Tufts University, Boston, working with Robert Jacob. Her research was on the next generation of brain-computer interfaces (BCIs) that detect and evaluate real-time brain signals using machine learning classification of functional near infrared spectroscopy (fNIRS) to build adaptable user interfaces for the general population. Her work won a Best Paper Award at ACM CHI 2016. She has also worked with Mary Czerwinski at Microsoft Research, investigating user-virtual agent interactions for the next generation of intelligent personal assistants. Beste will continue to work on building intelligent, adaptive interfaces that respond to both user cognitive and affective state in conjunction in her new Human-Computer Interaction lab.",
       img:"Beste.jpg",
       pdf:"895Report_Poorva.pdf",
       tenure: "2018 - 2020",
       description: "Photo of Beste Yuksel, a fair skineed woman with black-brown long wavy hair. She has glasses on and is smiling at the camera."
      },
       { 
       name:"Ilmi Yoon",
       bio:"Ilmi Yoon is a professor in the Computer Science Department at San Francisco State University. She started this YouDescribe collaboration from 2016 and supervised her students development in Mobile versions of it. Her research areas are Graphics and Gamification and AI/ML applications. She started development of YouDescribeX (AI enhanced version) with multiple contributors such as Drs. Fazli, iHorn, Siu and Das. and her students listed here. She is currently a PI/Co-PI of 4 NSF grants focusing on Computer Science Education and Diversity in Computing.",
       img:"ilmi.jpg",
       pdf:"895Report_Poorva.pdf",
       tenure: "2018 - Present",
       description: "Photo os Ilmi Yoon, an asian woman with fair skin and with long wavy brown hair. She is smiling brightly at the camera."
      },
       { 
       name:"Pooyan Fazli",
       bio:"Pooyan Fazli is an assistant professor and the founding director of the People and Robots Laboratory (PeRL) in the Department of Computer Science at San Francisco State University.  Previously, he was a postdoctoral fellow in the CORAL Research Group at Carnegie Mellon University and in the Laboratory for Computational Intelligence at the University of British Columbia, where he also received his Ph.D. His research focuses on artificial intelligence, autonomous robots, multi-robot systems, human-robot teams, and robot learning.",
       img:"PooyanFazli.jpg",
       pdf:"895Report_Poorva.pdf",
       tenure: "2018 - Present",
       description: "Photo of Pooyan Fazli, a fair skinned male with short spiked hair. He is wearing glasses in smiling at the camera."
      },
      { 
        name:"Jianfei",
        bio:"",
        img:"noImage.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "No image available. A silhouette image of a guy"
       },
      { 
        name:"Poorva Rathi",
        bio:"Poorva Rathi is currently a student in San Francisco State University pursuing her degree in  Master's in Science major Computer Science. She is working on the Frontend Development and Designing of Admin Panel and the other features for the YouDescribe website. Previously, Poorva worked as a Web Developer Summer Intern in a tech software startup.",
        img:"Poorva.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "Photo of Poorva Rathi, a brown skinned woman with long black hair. She is wearing a white dress and is smiling towards the camera."
       },
      { 
        name:"Vaishali Bisht",
        bio:"Vaishali Bisht is a Software Dev Engineer at Amazon. She completed her Master’s degree in Computer Science from San Francisco State University. Previously, she has worked on Microsoft Dynamics AX in India.",
        img:"Vaishali.png",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "Photo of Vaishali Bisht, a fair skinned woman with black hair. She is wearing a black dress and is standing on a pier in front of the Sea with Ships in the background"
       },
      { 
        name:"Raya Farshad",
        bio:"My name is Raya Farshad and I am pursuing my master’s degree of Computer Science at San Francisco State University. I also have interests in artificial intelligence and cloud computing. Currently I am working on caption-game website for YouDescribe project.",
        img:"noImage.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "No image available. A silhouette image of a guy"
       },
      { 
        name:"Jose Castanon",
        bio:"Jose is pursuing his master's in Computer Science at San Francisco State University after finishing his undergraduate studies in Spring 2020. He has an interest in full stack web development. He currently works on site maintenance and development for YouDescribe.",
        img:"noImage.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - Present",
        description: "No image available. A silhouette image of a guy"
       },
      { 
        name:"Aditya Bodi",
        bio:"I am pursuing my Master's in Computer Science at San Francisco State University. I have experience in Database Administration domain for 1.5 years at Cognizant Technology Solutions. For YouDescribe project, I am working on back-end API's for Audio Descriptions and On-Demand Descriptions. My interests are solving puzzles, soccer, and keyboard.",
        img:"aditya.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "Photo of Aditya Bodi, a brown man with short black hair and a short beard. He is wearing a suit and is smiling lightly at the camera."
       },
      { 
        name:"Brenna Tirumalashetty",
        bio:"Brenna is a former biotechnology researcher who is currently completing her MS in computer science. She is interested in the intersection between computer science and the biological sciences, and is currently a software engineer at the Climate Corporation in San Francisco, developing software tools to monitor agricultural research projects.",
        img:"brenna_2.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "Photo of Brenna Tirumalashetty, a fair skinned woman with short blonde hair. she is wearing a white dress and is smilling at the camera."
       },
      { 
        name:"Manish Patil",
        bio:"Manish is pursuing his Master’s degree from San Francisco State University in Computer Science. He has experience of working as a Software Developer in a start-up company in Mumbai, India. He is currently working on the YouDescribeX module.",
        img:"manish.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "Photo of Manish Patil, a brown skinned man with black hair and short beard. He is smiling at the camera and standing in front of a building on a street."
       },
      { 
        name:"Varun Sura",
        bio:"Varun is a Graduate student at San Francisco State University pursuing master’s degree in computer science. He is currently responsible for maintenance and development of iOS app for YouDescribe.",
        img:"Varun.jpg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2018 - 2020",
        description: "Photo of Varun Sura, a fair skinned man with long black hair and light stubble. He is wearing a black suit and is smiling at the camera and holding spectacles in his hands."
      },
       { 
        name:"Rodrigo Leme de Mello",
        bio:"Rodrigo Leme de Mello, Software Engineer, was part of the original Codesmith team that rebuilt from the ground-up YouDescribe in 2017. His career-long passion for accessibility led him to volunteer with the project for three years after the launch, expanding YouDescribe's capabilities and keeping the code running smoothly. Thank you, Rodrigo, for your many long volunteer hours. We are grateful. Rodrigo is currently a Partner Trainer for Amazon Web Services.",
        img:"RodrigoLeme.jpeg",
        pdf:"895Report_Poorva.pdf",
        tenure: "2017 - 2018",
        description: " Photo of Rodrigo Leme de Mello. A light-skinned man with a sparse, close-cropped beard crouches on a frozen lake. He wears a grey knit beanie, black jacket, jeans, and grey sneakers."
       },
    ]
  
    obj.sort((a, b) => (a.name > b.name) ? 1 : -1);
  
    const publications =[
      {
        pub:"Beste F. Yuksel, Pooyan Fazli, Umang Mathur*, Vaishali Bisht*, Soo Jung Kim*, Joshua Junhee Lee*, Seung Jung Jin*, Yue-Ting Siu, Joshua A Miele, Ilmi Yoon, “Human-in-the-Loop Machine Learning to Increase Video Accessibility for Visually Impaired and Blind Users” accepted to present at ACM DIS 2020."},
      { 
        pub:"Beste F. Yuksel, Pooyan Fazli, Umang Mathur*, Vaishali Bisht*, Soo Jung Kim*, Joshua Junhee Lee*, Seung Jung Jin*, Yue-Ting Siu, Joshua A Miele, Ilmi Yoon, “Increasing Video Accessibility for Visually Impaired Users with Human-in-the-Loop Machine Learning”, ACM CHI Extended Abstracts 2020 In Press."
      },
      {
        pub:' Ilmi Yoon, Umang Mathur*, Brenna Gibson Tirumalashetty*, Pooyan Fazli, Joshua Miele, "Video Accessibility for the Visually Impaired", In Proceedings of the Workshop on AI for Social Good at the International Conference on Machine Learning, ICML, Long Beach, CA, USA, 2019.'
    }];
  
    const projects = [
      {details:"Poorva Rathi, “Effective Web Interface Design and Development for Video Accessibility Challenges” Jun. 2020"},
      {details:"Andrew Scott, “Transfer Learning for Improved Video Description Performance for Visually Impaired and Blind” May 2020"},
      {details:"Vaishali Bisht, “User Study Design and Development for Video Description Application for Visually Impaired Users”, May 2020"},
      {details:"Jianfei Zhao , “Internet Application Development of YouDescribe Website”, Apr. 2020"},
      {details:"Umang Mathur, ”System Development For Human-In-The-Loop Machine Experiments to increase Video Accessibility for Visually Impaired and Blind Users”, Feb. 2020"},
      {details:"Cheng Li, “YouDescribe Android app – An Accessibility tool for adding Audiodescription to Online videos” Dec. 2018"},
      {details:"Madhura Patil, “YouDescribe Android App – An Accessibility Tool for Playing Audio Descriptions with Online Videos” Jan. 2018"},
      {details:"Rupal Khilari, “YouDescribe Ios App - An Accessibility Tool For Adding Audio Descriptions To Online Videos” May 2017"}
    ]
  
    projects.sort((a, b) => (a.details > b.details) ? 1 : -1);

    const awards = [
      {headline: "Winner of 2014 FCC Chairman's Award",
      subtext: "YouDescribe and the Descriptive Video Exchange (DVX); YouDescribe, developed by the Smith-Kettlewell Eye Research Institute, is a website and application protocol interface (API) for creating and playing crowd-sourced, synchronized video descriptions of YouTube videos.",
      link:"https://www.ski.org/project/descriptive-video-exchange-dvx"},
      {headline: "Blind Scientist at Smith-Kettlewell Eye Research Institute in San Francisco Receives Renowned Award - Online PR News",
      subtext:"Dr. Joshua A. Miele accepts prestigious award in Video Description category of FCC Chairman's 2014 AAA ceremony in Arlington, Virginia. FCC Chairman Tom Wheeler today presented Smith-Kettlewell Scientist, Dr. Joshua Miele, with the 2014 Award for Advancement in Accessibility",
      link:"https://onlineprnews.com/news/497822-1404770257-blind-scientist-at-smithkettlewell-eye-research-institute-in-san-francisco-receives-renowned-award.html/"},
      {headline: "Series: The Work of the Smith-Kettlewell Institute Part II: The Video Description Research and Development Center | AccessWorld | American Foundation for the Blind",
      subtext:"Although description (sometimes called audio description, video description, or a handful of other terms) didn't become formalized until the 1970s and 1980s, Josh Miele, a research scientist and principal investigator for the Smith-Kettlewell Institute in San Francisco, surmises that it was probably in effect a few thousand years ago.",
      link: "https://www.afb.org/aw/14/6/15682"},
      {headline: "Hearing Pictures — The California Sunday Magazine",
      subtext:"The Riviera Hotel & Casino, a vast, chiming monument to air conditioning and untrammeled tattoo artistry, was full of blind people last July. Thirteen hundred or so had come to Las Vegas for the American Council of the Blind’s 53rd annual conference",
      link:"https://story.californiasunday.com/rethinking-movies-for-the-blind"}
    ]
  
    this.setState({
      details: obj,
      publications:publications,
      projects:projects,
      awards:awards
    });
  }
  
  render(){
    return (
      <div>
        <header role="banner" className="w3-container w3-indigo">
        <h2 style={{textAlign:"center"}}>Credits Page</h2>
        </header>
        <div>
          <h1 style={{textAlign:"center", paddingTop:"20px"}}><u>Awards</u></h1>
          <div style={{marginLeft:"50px", marginRight:"50px"}}>
            <ol>
              {this.state.awards.map((award) =>
                <li key={award.key} style={{paddingTop:"0px"}}><a href={award.link} target="_blank">{award.headline}</a><p>{award.subtext}</p></li>
              )}
          </ol>
          </div>
        </div>
        <div>
          <h1 style={{textAlign:"center", paddingTop:"20px"}}><u>Masters Project</u></h1>
          <div style={{marginLeft:"50px", marginRight:"50px"}}>
          {/* <ol >
              {this.state.projects.map((project) =>
                <li key={project.key} style={{paddingTop:"10px"}}>{project.details}</li>
              )}
          </ol> */}
          <ol>
            <li> 
              Andrew Scott, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u>“Transfer Learning for Improved Video Description Performance for Visually Impaired and Blind”</u></a>, May 2020
            </li>
            <li> 
              Cheng Li, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u> “YouDescribe Android app – An Accessibility tool for adding Audiodescription to Online videos”</u></a>, Dec. 2018
            </li>
            <li> 
              Jianfei Zhao, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u> “Internet Application Development of YouDescribe Website”</u></a>, Apr. 2020
            </li>
            <li> 
              Madhura Patil, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u> “YouDescribe Android App – An Accessibility Tool for Playing Audio Descriptions with Online Videos”</u></a>, Jan. 2018
            </li>
            <li> 
              Poorva Rathi, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u> “Effective Web Interface Design and Development for Video Accessibility Challenges”</u></a>, Jun. 2020
            </li>
            <li> 
              Rupal Khilari, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u> “YouDescribe Android App – An Accessibility Tool for Playing Audio Descriptions with Online Videos”</u></a>, Jan. 2018
            </li>
            <li> 
              Umang Mathur, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u> ”System Development For Human-In-The-Loop Machine Experiments to increase Video Accessibility for Visually Impaired and Blind Users”</u></a>, Feb. 2020 
            </li>
            <li> 
              Vaishali Bisht, <a href={path.join(__dirname, 'assets', 'img','creditPage','895Report_Poorva.pdf')} target="_blank">
                <u> “User Study Design and Development for Video Description Application for Visually Impaired Users”</u></a>, May 2020
            </li>
          </ol>
          </div>
        </div>
        <div>
          <h1 style={{textAlign:"center", paddingTop:"20px"}}><u>Publications</u></h1>
          <div style={{marginLeft:"50px", marginRight:"50px"}}>
          <ol >
              {this.state.publications.map((publication) =>
                <li key={publication.key} style={{paddingTop:"10px"}}>
                  {publication.pub}
                </li>
              )}
          </ol>
          </div>
        </div>
        <div>
          <h1 style={{textAlign:"center", paddingTop:"20px"}}><u>Meet the members</u></h1>
          <table className="w3-table">
              <thead >
                <tr className="w3-col">
                  <th style={{width:"200px"}}>Name</th>
                  <th style={{width:"150px"}}>Image</th>
                  <th style={{width:"1000px"}}>Description</th>
                  <th style={{width:"100px"}}>Paper</th>
                </tr>
              </thead>
                {this.state.details.map((home, index) => 
                <div key={index}>
            
              <tbody className="w3-striped tbody" >
                <tr style={{paddingTop:"10px", height:"200px"}}>
                <td style={{width:"200px", marginLeft: "auto",marginRight: "auto"}}>{home.name}
                <p>{home.tenure}</p>
                </td>
                
                <td style={{width:"150px"}} className="w3-card-2">
                  <img alt= {home.description} className="w3-image" src={path.join(__dirname, 'assets', 'img', 'creditPage',`${home.img}`)}/>
                </td>
                <td style={{width:"1000px"}}>{home.bio}</td>
                <td style={{width:"100px"}}>
                  {/* <a href={home.pdf} class="fa fa-file-pdf-o" target="_blank" style={{fontSize:"48px",color:"red"}} download></a> */}
                  <a href={path.join(__dirname, 'assets', 'img','creditPage',`${home.pdf}`)} className="fa fa-file-pdf-o" target="_blank" style={{fontSize:"48px",color:"red"}} ></a>
                </td>
                </tr>
          
              </tbody>
          </div>
          )}
          </table>
        </div>
      </div>
    
    );
  }
}

export default CreditsPage;
