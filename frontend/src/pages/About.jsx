import { FaUserTie, FaGraduationCap, FaAward, FaLightbulb } from 'react-icons/fa';
import Layout from '../components/Layout';
import aboutMainImage from '../assets/images/about.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { celebrities } from "../Constants/CelebrityData";

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 5000,
  cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
  pauseOnHover: true,
  fade: true,
  arrows: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false
      }
    }
  ],
  customPaging: (i) => (
    <div className="w-3 h-3 mx-2 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300">
      <div className="w-full h-full rounded-full transform scale-0 bg-white transition-transform duration-500 group-hover:scale-100"></div>
    </div>
  ),
  appendDots: (dots) => (
    <div style={{ position: "absolute", bottom: "20px", width: "100%" }}>
      <ul className="flex justify-center space-x-2"> {dots} </ul>
    </div>
  )
};


export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Transforming Education
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Empowering minds through innovative learning experiences and world-class education
              that transforms possibilities into reality.
            </p>
          </div>

          {/* Hero Image Section */}
          <div className="flex md:flex-row flex-col items-center justify-between gap-12 mb-20">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-yellow-500 leading-tight">
                Empowering Minds through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Quality Education
                </span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed">
                Our mission is to democratize education by providing accessible, engaging, and
                effective learning opportunities to students worldwide. Through cutting-edge
                technology and expert instruction, we're building the future of education.
              </p>
            </div>

            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <img
                src={aboutMainImage}
                alt="Education Illustration"
                className="relative z-10 transform hover:scale-105 transition-transform duration-300"
                style={{
                  filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.2))",
                }}
              />
            </div>
          </div>

          {/* Quote Slider Section */}
          {/* Quote Slider Section */}
<div className="mb-20">
  <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    Inspiring Words
  </h2>
  <div className="relative rounded-2xl overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-lg"></div>
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full blur-[100px] opacity-30"></div>
    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
    
    <Slider {...settings} className="h-[500px]">
      {celebrities.map((celebrity, index) => (
        <div key={index} className="relative h-[500px] px-4 py-16">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-4xl mx-auto">
            {/* Image container with decorative ring */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <img
                src={celebrity.image}
                alt={celebrity.title}
                className="w-40 h-40 rounded-full object-cover border-4 border-white/50 shadow-2xl relative z-10 transform hover:scale-105 transition-all duration-300"
              />
              {/* Decorative ring */}
              <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
            </div>
            
            {/* Quote content */}
            <div className="space-y-6 relative z-10">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                {celebrity.title}
              </h3>
              <div className="relative">
                <span className="absolute -left-4 -top-4 text-6xl text-white/20">"</span>
                <p className="text-2xl text-white/90 italic leading-relaxed px-8">
                  {celebrity.description}
                </p>
                <span className="absolute -right-4 bottom-0 text-6xl text-white/20">"</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
</div>


          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                icon: <FaGraduationCap className="text-blue-500" />,
                title: "Expert Learning",
                description: "Access to world-class courses and instructors"
              },
              {
                icon: <FaUserTie className="text-purple-500" />,
                title: "Professional Growth",
                description: "Career-focused skill development and guidance"
              },
              {
                icon: <FaAward className="text-pink-500" />,
                title: "Certification",
                description: "Industry-recognized certificates and credentials"
              },
              {
                icon: <FaLightbulb className="text-yellow-500" />,
                title: "Innovation",
                description: "Cutting-edge learning technologies and methods"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-lg p-12 rounded-3xl shadow-lg">
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Vision
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
              To create a global learning ecosystem where knowledge knows no boundaries, 
              where every individual has the opportunity to reach their full potential, 
              and where education becomes the catalyst for positive change in the world.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
