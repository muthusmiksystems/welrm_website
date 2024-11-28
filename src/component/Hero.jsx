import React, { useRef, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Avatar, Button, Accordion, AccordionSummary, AccordionDetails, Link, Divider } from '@mui/material';
import cardData from '../Data/cardData';
import Header from './HomeNav';

import bgImage from "../Assests/bg.png";
import "./Hero.css";
import Cards from "./Cards"
import HeroCards from "./heroCards"
import HeroCardImg1 from "../Assests/HeroCardImg1.png"
import HeroCardImg2 from "../Assests/HeroCardImg2.png"
import HeroCardImg3 from "../Assests/HeroCardImg3.png"
import HeroCardImg4 from "../Assests/HeroCardImg4.png"
import aboutImg from "../Assests/aboutImg1.png"
import groupImg from "../Assests/groupimg.png"
import Ell from "../Assests/Ell.png"
import Frame1 from "../Assests/frame1.png"
import Frame2 from "../Assests/frame2.png"
import Frame3 from "../Assests/frame3.png"
import sec1 from "../Assests/sec1.png"
import sec2 from "../Assests/sec2.png"
import sec3 from "../Assests/sec3.png"
import ceo from "../Assests/ceo.png"
import cofounder from "../Assests/cofounder.png"
import co from "../Assests/co.png"
import HomeBg from "../Assests/homebg.png"
import Footer from './Footer';

function Hero() {
  const [expanded, setExpanded] = useState(false);
  const aboutRef = useRef(null); 
  const ourStoryRef = useRef(null);
  const homeRef = useRef(null);


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  

  const scrollToTop = () => {
    if (homeRef.current) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  const scrollToAbout = () => {
    if (aboutRef.current) {
      
      const aboutPosition = aboutRef.current.getBoundingClientRect().top + window.scrollY;
  
     
      window.scrollTo({
        top: aboutPosition - 50,
        behavior: "smooth",
      });
    }
  };

  const scrollToOurStory = () => {
    if (ourStoryRef.current) {
      const ourStoryPosition = ourStoryRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: ourStoryPosition - 50, // Adjust offset as needed
        behavior: "smooth",
      });
    }
  };
  const CustomExpandIcon = ({ isExpanded }) => (
    <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#7d7d7d', marginRight: '10px', }}>
      {isExpanded ? '−' : '+'}
    </Typography>
  );
  return (
    <div style={{ backgroundColor: "#F1F1F1" }}>
      <Header onAboutClick={scrollToAbout}/>
      <Box ref={homeRef}
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 8 },
          position: 'relative',
        }}
      >

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />


        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Modern-Antiqua',
            fontWeight: 500,
            color: 'white',
            textAlign: 'center',
            zIndex: 2,
            fontSize: { xs: '24px', sm: '30px', md: '34px', lg: "40px" },
            mt: { xs: 0, md: 0 },
          }}
        >
          Struggling to Attract Guests?
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Mona-Sans',
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            mt: 2,
            zIndex: 2,
            fontSize: { xs: '28px', sm: '36px', md: '40px', lg: "40px" },
            px: { xs: 2, md: 6 },
          }}
        >
          Skyrocket Your{' '}
          <Button
            sx={{
              color: 'white',
              border: '2px solid #C42A25',
              fontSize: { xs: '20px', sm: '30px', md: '40px', lg: "40px" },
              fontWeight: 700,
              px: { xs: 1, md: 3 },
              borderRadius: '35px',
              lineHeight: { xs: '38px', md: '50px' },
              margin: "20px 0px",
              backgroundColor: '#C42A2533',
            }}
          >
            HOTEL BOOKINGS
          </Button>{' '}
          & Revenue Instantly
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: 'Mona-Sans',
            fontWeight: 400,
            color: 'white',
            textAlign: 'center',
            mt: 2,
            zIndex: 2,
            fontSize: { xs: '16px', sm: '20px', md: '24px', lg: "30px" },
            px: { xs: 2, md: 6 },
          }}
        >
          Don't Let Your Competitors Steal Your Customers. Join WELRM today!
        </Typography>

        <Button
          href="/loginReg"
          sx={{
            mt: 4,
            fontFamily: 'Mona-Sans',
            fontWeight: 600,
            color: 'white',
            bgcolor: '#C42A25',
            px: 4,
            py: 1,
            zIndex: 2,
            fontSize: { xs: '18px', sm: '20px', md: '24px' },
            '&:hover': {
              bgcolor: '#9f1e1a',
            },
          }}
        >
          YES, I WANT MORE BOOKINGS
        </Button>


        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ mt: 4, zIndex: 2, px: { xs: 2, md: 4 } }}
        >
          {cardData.map((card, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Cards
                cardTitle={card.cardTitle}
                cardDetail={card.cardDetail}
                cardImg={card.cardImg}
              />
            </Grid>
          ))}
        </Grid>
      </Box>



      <Box className="Dicover-section" sx={{
        backgroundColor: "#ffffff",
        paddingY: "20px"
      }}>
        <Box
          sx={{
            paddingTop: "30px",
            paddingBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}>
          <Box className="Discover-header" sx={{ width: "80%" }}>
            <Typography
              sx={{
                fontFamily: 'Mona-Sans',
                fontWeight: 700,
                color: 'black', // Changed to white for better visibility
                fontSize: { lg: '40px', md: '30px', sm: '20px' },  // Increased font size for better visibility
                textAlign: 'center',
                zIndex: 2, // Ensure text is above the overlay
              }}
            >
              “ Discover How <span style={{ backgroundColor: "#C42A25", color: "#000", borderRadius: "5px" }}> &nbsp;WELRM&nbsp;</span> Boosts Your Revenue and Attracts More Customers ”
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          paddingTop: "40px"
        }}>
          <HeroCards
            title="#1 Maximize Your Revenue"
            details1="Connect with a larger pool of guests, boosting bookings and revenue."
            details2="Offer competitive rates with flexible pricing options."
            details3="Optimize operations with our user-friendly platform and excellent support."
            HeroCardImg={HeroCardImg1}
          />
          <HeroCards
            title="#2 Reduce Your Workload"
            details1="Automate your room booking system effortlessly."
            details2="Enhance guest experience while reducing staff workload."
            details3="Enable real-time communication, minimizing face-to-face interactions."
            HeroCardImg={HeroCardImg2}
          />
          <HeroCards
            title="#3 Increase Your Bookings"
            details1="List your hotel at a lower cost and reach a wider audience, driving more bookings and visibility"
            details2="Automate marketing to attract more guests."
            details3="Provide 24/7 support to enhance guest satisfaction."
            HeroCardImg={HeroCardImg4}
          />
          <HeroCards
            title="#4 Save Money"
            details1="Showcase your hotel with a pocket-friendly listing fee, attracting more guests while maximizing visibility and bookings."
            details2="Avoid costly commissions charged by other platforms."
            details3="Start saving and boosting your revenue today."
            HeroCardImg={HeroCardImg3}
          />
        </Box>
      </Box>



      <Box
        ref={aboutRef}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1f1f1",
          paddingX: "20px",
          paddingTop:"40px",
          gap: "100px",
          width: "100%",
          maxWidth: "1350px",
          margin: "auto",
        }}
      >
        {/* Left Text Section */}
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "50%" }, // Full width on small screens, half on larger
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: "black",
              fontSize: { lg: "40px", md: "30px", sm: "20px" },
            }}
          >
            “ABOUT{" "}
            <span
              style={{
                backgroundColor: "#C42A25",
                color: "#fff",
                borderRadius: "5px",
              }}
            >
              &nbsp;WELRM&nbsp;
            </span>
            ”
          </Typography>

          <Box sx={{ paddingTop: "15px" }}>
            {[
              "At WELRM, we understand the challenges hoteliers face in today’s competitive market. That’s why we offer a unique platform tailored to help you increase visibility, boost bookings, and grow your business. By listing your hotel with us, you gain access to a wide audience of domestic and international travelers looking for quality stays at every price point.",
              "Our user-friendly tools allow you to manage your property listings, update availability, and set competitive rates effortlessly. With affordable listing fees, you can showcase your hotel to potential guests without straining your budget. Plus, our advanced marketing tools ensure your hotel stands out, driving more traffic and converting views into bookings.",
              "Join our community of trusted partners and take advantage of:",
            ].map((paragraph, index) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: "Mona-Sans",
                  fontWeight: 400,
                  color: "#4B5563",
                  fontSize: { lg: "20px", md: "18px", sm: "14px" },
                  marginTop: "10px",
                }}
              >
                {paragraph}
              </Typography>
            ))}

            <ul style={{ paddingLeft: "20px", marginTop: "10px", listStyleType: 'disc' }}>
              <li
                style={{
                  fontFamily: "Mona-Sans",
                  fontWeight: 400,
                  color: "#4B5563",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                <strong style={{ fontWeight: 600 }}>Cost-effective listing packages</strong> for every hotel size.
              </li>
              <li
                style={{
                  fontFamily: "Mona-Sans",
                  fontWeight: 400,
                  color: "#4B5563",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                <strong style={{ fontWeight: 600 }}>Increased visibility</strong> among millions of potential guests.
              </li>

              <li
                style={{
                  fontFamily: "Mona-Sans",
                  fontWeight: 400,
                  color: "#4B5563",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                <strong style={{ fontWeight: 600 }}>Seamless management</strong> of bookings, availability, and rates.
              </li>

              <li
                style={{
                  fontFamily: "Mona-Sans",
                  fontWeight: 400,
                  color: "#4B5563",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                <strong style={{ fontWeight: 600 }}>Dedicated support</strong> to assist you every step of the way.
              </li>
            </ul>
            
          </Box>
        </Box>

        {/* Right Image Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px", // Space between images
            maxWidth: { xs: "100%", md: "50%" }, // Full width on mobile, smaller on large screens
          }}
        >
          <img
            src={aboutImg}
            alt="Hotel Building"
            style={{
              width: "100%",
              maxWidth: "350px",
              borderRadius: "10px",
              objectFit: "contain",
            }}
          />
        </Box>
        
      </Box>

          <Typography
              sx={{
                fontFamily: "Mona-Sans",
                fontWeight: 400,
                color: "#4B5563",
                fontSize: "16px",
                paddingX: {xs:"20px",sm:"30px",md:"50px",lg:"120px"},
                paddingTop:"10px",
                paddingBottom:"40px"
              }}
            >
              Let us help you elevate your hotel’s presence and attract the right
              guests, all while optimizing your revenue potential.
            </Typography>


      <Box>
        <Box style={{
          backgroundColor: "#C42A2580",
          padding: "20px 60px"
        }}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Center horizontally
              alignItems: "center", // Center vertically if needed
              marginBottom: "30px"
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically if needed
                // height: '100vh', // Full viewport height
                padding: { xs: '20px', sm: '40px', md: '60px' }, // Responsive padding
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on small screens
                  backgroundColor: 'transparent', // Background color for the banner
                  borderRadius: '20px', // Rounded corners
                  padding: '15px 30px', // Padding inside the box
                  textAlign: 'center', // Center the text
                  margin: 'auto',
                  display: 'inline-block', // Ensures the banner fits its content
                  maxWidth: '800px', // Set a max width for larger screens
                  width: '100%', // Ensure it takes the full width on small screens
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    backgroundColor: 'white', // White background for text
                    color: '#4A4A4A', // Text color
                    display: 'block', // Ensures the background applies only to the text
                    padding: '10px 10px', // Slight padding for visual comfort
                    borderRadius: '10px', // Rounded corners for the text
                    marginBottom: '-8px',
                    width: '100%', // Full width to allow responsiveness
                  }}
                >
                  Discover how we have helped countless hotel owners like
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    backgroundColor: 'white', // White background for text
                    color: '#4A4A4A', // Text color
                    display: 'inline', // Ensures the background applies only to the text
                    padding: '10px 10px', // Slight padding for visual comfort
                    borderRadius: "10px",
                    width: '100%', // Full width to allow responsiveness
                  }}
                >
                  you boost their revenue and grow their business.
                </Typography>
              </Box>
            </Box>
          </Box>



          {/* Testimonials Section */}
          <Grid container spacing={4}>
            {[1, 2, 3,].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Card sx={{
                  borderRadius: "30px"
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" borderRadius="30px" mb={2}>
                      <Avatar
                        src={Ell}
                        alt="Amado Copper"
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">Amado Copper</Typography>

                      </Box>
                    </Box>
                    <Typography variant="body2" color="#FFA800">★★★★★</Typography>
                    <Typography variant="body2" paragraph>

                      Booking My Hotel Stay Through Welrm Was An Absolute Breeze! From Browsing Through Their Extensive Selection Of Accommodations To Securing My Reservation With Just A Few Clicks, Everything Was Seamless.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Call to Action Section */}
          <Box textAlign="center" mt={4} sx={{
            marginBottom: "60px"
          }}>
            <Button href="/loginReg" variant="contained" color="error" size="large">
              Get Listed at Affordable Rates
            </Button>
          </Box>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          paddingY: "60px",
          flexWrap: "wrap",
          gap: "30px",
          paddingX: "50px"
        }}>
          <Box >
            <img style={{
              maxWidth: "330px",
              width: "100%",

            }} src={Frame1} alt="" />
          </Box>
          <Box>
            <img style={{
              maxWidth: "330px",
              width: "100%",
            }} src={Frame2} alt="" />
          </Box>
          <Box>
            <img style={{
              maxWidth: "330px",
              width: "100%",
            }} src={Frame3} alt="" />
          </Box>
        </Box>
      </Box>



      <Box className="Dicover-section" sx={{
        backgroundColor: "#ffffff",
        paddingBottom: '30px',

      }}>
        <Box
          sx={{
            paddingTop: "30px",
            paddingBottom: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}>
          <Box className="Discover-header" sx={{ width: "80%" }}>
            <Typography
              sx={{
                fontFamily: 'Mona-Sans',
                fontWeight: 700,
                color: 'black', // Changed to white for better visibility
                fontSize: { lg: '40px', md: '30px', sm: '20px' },  // Increased font size for better visibility
                textAlign: 'center',
                zIndex: 2, // Ensure text is above the overlay
              }}
            >
              Unlock Your Hotel's Potential with <span style={{ backgroundColor: "#C42A25", color: "#ffffff", borderRadius: "5px" }}> &nbsp;WELRM&nbsp;</span>
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          paddingTop: "40px"
        }}>
          <HeroCards
            title="Expand Your Customer Base"
            details1="Ensure your hotel stands out in a crowded market."
            details2="Showcase high-quality photos and detailed descriptions to attract more guests."
            details3="Boost occupancy rates with an easy-to-use booking system."
            HeroCardImg={sec1}
          />
          <HeroCards
            title="Establish Your Hotel as a Trusted Name"
            details1="Enhance customer experience with a seamless booking process."
            details2="Personalize guest experiences with customized messages and special offers."
            details3="Highlight positive reviews to build trust with potential guests."
            HeroCardImg={sec2}
          />
          <HeroCards
            title="Leverage Data-Driven Insights"
            details1="Manage listings, bookings, and customer interactions in one place."
            details2="Access real-time analytics to make informed decisions."
            details3="Receive personalized recommendations for pricing, promotions, and marketing campaigns."
            HeroCardImg={sec3}
          />

        </Box>
        <Box textAlign="center" mt={4} sx={{
          marginBottom: "60px"
        }}>
          <Button href="/loginReg" variant="contained" color="error" size="large">
            Get Listed at Affordable Rates
          </Button>
        </Box>
      </Box>




      <Box>
       


        <Box ref={ourStoryRef} 
        sx={{  
          bgcolor: "#64748B",
          padding: { lg: "30px 90px", md: "30px 60px", sm: "30px 60px", xs: "30px 10px" },
          textAlign: "Center",
          color: "#FFF",
          marginBottom: '30px'
        }}>
          <Typography sx={{
            fontSize: "40px",
            fontWeight: "700",

          }}>OUR STORY</Typography>
          {/*<Box sx={{
            bgcolor: "rgba(255, 255, 255, 0.1)",
            padding: { lg: "20px 20px", md: "20px 10px", sm: "20px 0px" },
            border: "2px solid white",
            borderRadius: "10px",
            color: "rgba(255, 255, 255, 0.8)"
          }}>
             <Typography sx={{
              fontSize: { lg: '20px', md: '20px', sm: '16px' },
              fontWeight: "400",
              paddingTop: "20px"
            }}>
              At <span style={{ color: 'white' }}>WELRM</span>, we’re transforming the way travelers and hoteliers connect, offering seamless experiences through both our app and website. Whether you’re planning a trip or managing a property, we make the process simple, efficient, and accessible.
            </Typography>
            <Typography sx={{
              fontSize: { lg: '20px', md: '20px', sm: '16px' },
              fontWeight: "400",
              paddingTop: "20px"
            }}>
              For travelers, our app and website provide easy access to a wide range of hotels, resorts, and farmhouses across India. Browse and compare options, choose the perfect accommodation, and book directly—all in just a few taps or clicks. Once your booking is complete, you’ll receive an instant confirmation message on your phone, giving you peace of mind for your upcoming stay.
            </Typography>
            <Typography sx={{
              fontSize: { lg: '20px', md: '20px', sm: '16px' },
              fontWeight: "400",
              paddingTop: "20px"
            }}>
              For hoteliers, we offer a straightforward way to register your hotel, resort, or farmhouse on our platform. Our online app and website help you expand your reach by showcasing your property to a wide audience of travelers. We provide a range of tools to manage bookings, update availability, and optimize your presence, all while keeping costs low and benefits high.
            </Typography>
            <Typography sx={{
              fontSize: { lg: '20px', md: '20px', sm: '16px' },
              fontWeight: "400",
              paddingTop: "20px"
            }}>
              We collaborate with a variety of properties to ensure our customers always have access to the best accommodations, whether it's for a weekend getaway or a luxury vacation. Our goal is simple: to offer the best service for both guests and hoteliers, making every booking effortless and every stay memorable.
            </Typography> 

          </Box>*/}
          <Button variant="contained" color="error" size="large">
            Connecting Travelers & Hoteliers with Ease
          </Button>
          <Typography sx={{
            fontSize: { lg: '20px', md: '20px', sm: '16px' },
            fontWeight: "400",
            paddingTop: "20px"
          }}>
            At <span style={{ color: 'white' }}>WELRM</span>, we’re redefining travel and accommodation by creating a seamless link between travelers and hoteliers. Here’s how we bring value to both sides.
          </Typography>
          <Grid container sx={{marginTop:'20px'}}>
            <Grid sx={{width:{xs:'100%', sm:'100%', md:'70%', lg:'70%' }}}>
              <Box>
                <Box sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  paddingX: '8px',
                  paddingY: '3px',
                  borderRadius: "10px",
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth:"200px",
                   marginY:'20px'
                }}>
                  <Typography sx={{
                    fontSize: { lg: '20px', md: '20px', sm: '16px' },
                    fontWeight: "400",
                  }}>
                    For Travelers
                  </Typography>
                  
                </Box>
                <ul style={{ paddingLeft: "20px", marginTop: "10px", listStyleType: 'disc' ,color:'white',textAlign:"left"}}>
                    <li
                      style={{
                        fontFamily: "Mona-Sans",
                        fontWeight: 400,
                        
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>Discover & Compare</strong> Easily browse a wide range of hotels, resorts, and farmhouses across India.
                    </li>
                    <li
                      style={{
                        fontFamily: "Mona-Sans",
                        fontWeight: 400,
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>Book with Confidence</strong> Choose your ideal stay and book instantly, receiving confirmation right on your phone for peace of mind.
                    </li>
                    
                </ul>
              </Box>
              <Box>
                <Box sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  paddingX: '8px',
                  paddingY: '3px',
                  borderRadius: "10px",
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth:"200px",
                  marginY:'20px'
                }}>
                  <Typography sx={{
                    fontSize: { lg: '20px', md: '20px', sm: '16px' },
                    fontWeight: "400",
                  }}>
                   For Hotel Owners
                  </Typography>
                  
                </Box>
                <ul style={{ paddingLeft: "20px", marginTop: "10px", listStyleType: 'disc' ,color:'white',textAlign:"left"}}>
                    <li
                      style={{
                        fontFamily: "Mona-Sans",
                        fontWeight: 400,
                        
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>Discover & Compare</strong> Easily browse a wide range of hotels, resorts, and farmhouses across India.
                    </li>
                    <li
                      style={{
                        fontFamily: "Mona-Sans",
                        fontWeight: 400,
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>Book with Confidence</strong> Choose your ideal stay and book instantly, receiving confirmation right on your phone for peace of mind.
                    </li>
                    
                </ul>
              </Box>
              <Box>
                <Box sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  paddingX: '8px',
                  paddingY: '3px',
                  borderRadius: "10px",
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth:"200px",
                  marginY:'20px'
                  }}>
                  <Typography sx={{
                    fontSize: { lg: '20px', md: '20px', sm: '16px' },
                    fontWeight: "400",
                  }}>
                    Our Commitment
                  </Typography>
                  
                </Box>
                <ul style={{ paddingLeft: "20px", marginTop: "10px", listStyleType: 'disc' ,color:'white',textAlign:"left"}}>
                    <li
                      style={{
                        fontFamily: "Mona-Sans",
                        fontWeight: 400,
                        
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>Discover & Compare</strong> Easily browse a wide range of hotels, resorts, and farmhouses across India.
                    </li>
                    <li
                      style={{
                        fontFamily: "Mona-Sans",
                        fontWeight: 400,
                        fontSize: "18px",
                        marginTop: "5px",
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>Book with Confidence</strong> Choose your ideal stay and book instantly, receiving confirmation right on your phone for peace of mind.
                    </li>
                    
                </ul>
              </Box>
            </Grid>
            <Grid sx={{width:{xs:'100%', sm:'100%', md:'30%', lg:'30%' }}}>

              <img
                src={groupImg}
                alt="Hotel Building"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  objectFit: "contain",
                  paddingX:"20px",
                  height:'500px'
                }}
              />

            </Grid>
          </Grid>
        </Box>

      </Box>


      <Box sx={{
        bgcolor: "#FFF",
        marginTop: "50px",
        marginBottom: "50px"
      }}>
        <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: '700', fontSize: "30px", marginBottom: '20px' }}>
            Questions? Look here.
          </Typography>
          <Typography variant="body2" sx={{ color: '#7d7d7d', marginBottom: '40px', fontWeight: "600" }}>
            Can't find an answer? Call us at <Link href="tel:+12345678976" style={{ color: '#7d7d7d', textDecoration: 'none' }}>(+91-9584290842)</Link> or email{' '}
            <Link href="mailto:contact@welrm.com" style={{ color: '#7d7d7d', textDecoration: 'none' }}>info@welrm.com</Link>!
          </Typography>

          <Divider />

          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} disableGutters elevation={0} square>
            <AccordionSummary>
              <CustomExpandIcon isExpanded={expanded === 'panel1'} />
              <Typography variant="body1" sx={{ fontWeight: 500, marginTop: "6px" }}>What benefits will my hotel get from using your Website/App?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#7d7d7d', textAlign: 'justify' }}>
                By using our Website/App, your hotel will benefit from increased visibility, streamlined operations, and better guest satisfaction.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Divider />

          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} disableGutters elevation={0} square>
            <AccordionSummary>
              <CustomExpandIcon isExpanded={expanded === 'panel2'} />
              <Typography variant="body1" sx={{ fontWeight: 500, marginTop: "6px" }}>How much does it cost to use your Website/App?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#7d7d7d', textAlign: 'justify' }}>
                The cost depends on your hotel's size and the features you want to use. Contact us for a detailed quote.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Divider />

          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} disableGutters elevation={0} square>
            <AccordionSummary>
              <CustomExpandIcon isExpanded={expanded === 'panel3'} />
              <Typography variant="body1" sx={{ fontWeight: 500, marginTop: "6px" }}>What kind of support do you offer to hotel owners?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#7d7d7d', textAlign: 'justify' }}>
                We offer 24/7 support to our hotel owners via phone, email, and live chat. Our team is dedicated to helping you succeed.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Divider />

          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} disableGutters elevation={0} square>
            <AccordionSummary>
              <CustomExpandIcon isExpanded={expanded === 'panel4'} />
              <Typography variant="body1" sx={{ fontWeight: 500, marginTop: "6px" }}>How do I know my data is safe and secure with your Website/App?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#7d7d7d', textAlign: 'justify' }}>
                Our Website/App uses industry-standard encryption and follows strict data protection policies to ensure your information is safe.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Box sx={{
          backgroundImage: `url(${HomeBg})`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "30px",
          paddingBottom: "50px",
          marginBottom: "50px"

        }}>
          <Typography sx={{
            fontSize: "26px",
            fontWeight: "600",
            color: "#FFF"
          }}>At WELRM, as our name suggests, we’re all about  “Welcome Rooms” </Typography>
          <Box sx={{
            bgcolor: "#FFFFFFCC",
            textAlign: "center",
            padding: "10px 10px",
            border: "1px solid #C42A25",
            borderRadius: "10px",
            marginTop: "30px"
          }}>
            <Typography sx={{
              fontSize: {lg: "25px", md: "18px" , sm:"16px"},
              fontWeight: "600",
              color: "#C4 2A25"            
            }}>“Welcome Rooms”</Typography>
          </Box>
          <Typography sx={{
            fontSize: { lg: '20px', md: '20px', sm: '16px' },
            fontWeight: "600",
            color: "#FFF",
            margin: { lg: "30px 100px", md: "10px 30px", sm: "30px 20px", xs: "10px 10px" },
            textAlign: 'center',
          }}>
            Our journey began in 2019 with a clear mission: to offer customers the finest hotels and accommodations. Since then, we've established ourselves as leaders in the hospitality industry, dedicated to providing exceptional service, comfort, and choice. We are proud to be one of the best providers of hotels and rooms, ensuring every guest experience is welcoming, seamless, and memorable. Whether you're traveling for business, leisure, or special occasions, WELRM is here to offer you the best in hospitality.
          </Typography>
        </Box>
        <Footer onAboutClick={scrollToAbout} onOurStoryClick={scrollToOurStory} onHomeClick={scrollToTop}/>
        <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#C42A25',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        ↑
      </button>
      </Box>
    </div>  
  );
}

export default Hero;