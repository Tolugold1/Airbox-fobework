import { useState } from 'react';
import { Link } from 'react-router-dom';
// import image from '../assets/image.jpg';
import  heroImage from '../assets/online-ticket-booking.jpg';
import { FiMenu, FiX } from "react-icons/fi";

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="bg-[#121221] text-white w-full min-h-screen">
      {/* Navbar */}
      <header className="bg-[#1a1a2e]">
       <div className='flex justify-between items-center px-10 py-6 '>
          <h1 className="text-2xl font-bold text-pink-500">Schedulo</h1>
          <nav className="md:space-x-6 hidden md:flex  items-center">
            <Link to="/" className="hover:text-pink-400 ">Home</Link>
            <Link to="/login" className="hover:text-pink-400">Login</Link>
            <Link to="/signup" className="hover:text-pink-400">Sign up</Link>
            <Link to="/signup" className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600">Get Started</Link>
          </nav>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="flex flex-col space-y-4 bg-[#1a1a2e] text-center py-4">
            <Link to="/" onClick={closeMenu} className="block py-2 hover:text-pink-400">Home</Link>
            <Link to="/login" onClick={closeMenu} className="block py-2 hover:text-pink-400">login</Link>
            <Link to="/signup" onClick={closeMenu} className="block py-2 hover:text-pink-400">sign up</Link>
            <Link to="/signup" onClick={closeMenu} className="block py-2 bg-pink-500 mx-10 rounded hover:bg-pink-600">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center px-10 py-20">
        <div className="md:w-1/2">
          <h2 className="font-bold leading-tight vsm:text-6xl lg:text-7xl">Delivering IT solutions that enable you to work smarter.</h2>
          <p className="mt-4 text-gray-1400">
            Discover powerful digital solutions with our expert team. Transform your online presence and grow your business.
          </p>
          {/* <Link to="/services" className="mt-6 inline-block bg-pink-500 px-6 py-3 rounded text-lg hover:bg-pink-600">
            Discover More
          </Link> */}
        </div>
        <div className="md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
          <img src={heroImage} width="500" height="400" alt="IT Solutions" className="rounded-[25px] shadow-lg" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-10 py-16 bg-[#1a1a2e]">
        <h2 className="text-3xl font-bold text-center mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">📊 Real-Time Business Analytics</h3>
              <p className="mt-2 text-gray-400">
                Get insights on bookings, revenue, and trends with our interactive dashboard to optimize business performance.
              </p>
          </div>
          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">📅 Seamless Online Booking</h3>
            <p className="mt-2 text-gray-400">
              Allow clients to book your services instantly with our easy-to-use and fully automated booking system.
            </p>
          </div>

          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">👥 Client & Business  Profiles</h3>
            <p className="mt-2 text-gray-400">
              Businesses can manage profiles, services, and bookings, while clients can track their reservations all in one place.
            </p>
          </div>

          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">✅ Easy Cancellations & Rescheduling</h3>
            <p className="mt-2 text-gray-400">
              Give clients the flexibility to cancel or reschedule bookings, while businesses can manage availability hassle-free.
            </p>
          </div>

          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">💳 Secure Payment Integration</h3>
            <p className="mt-2 text-gray-400">
              Accept online payments with secure payment gateways while ensuring a smooth transaction experience.
            </p>
          </div>

          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">📩 Automated Notifications & Reminders</h3>
            <p className="mt-2 text-gray-400">
              Reduce no-shows with automated email/SMS reminders, keeping clients updated on their bookings.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-10 py-16 text-center">
        <h2 className="text-3xl font-bold">Unlock Astonishing Results in 3 Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">📞 Free Consultation</h3>
            <p className="mt-2 text-gray-400">Discuss your needs and get expert advice.</p>
          </div>
          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">🎯 Discover Solutions</h3>
            <p className="mt-2 text-gray-400">Choose the best digital strategy tailored to you.</p>
          </div>
          <div className="bg-[#29293f] p-6 rounded shadow">
            <h3 className="text-xl font-semibold">🚀 Execute & Grow</h3>
            <p className="mt-2 text-gray-400">We implement and optimize for maximum success.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-10 py-16 bg-[#1a1a2e]">
        <h2 className="text-3xl font-bold text-center">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#29293f] p-6 rounded shadow">
            <p className="text-gray-400">
              "Since using this platform, our bookings have increased by 75%, and our clients love how easy it is to schedule appointments!"
            </p>
            <h3 className="mt-4 font-semibold text-pink-400">Olaboye Theophilus</h3>
            <p className="text-gray-500 text-sm">CEO, Luxe Beauty Spa</p>
          </div>

          <div className="bg-[#29293f] p-6 rounded shadow">
            <p className="text-gray-400">
              "Managing my business has never been easier! The automated scheduling and reminders have saved me so much time."
            </p>
            <h3 className="mt-4 font-semibold text-pink-400">Adeoye Timileyin</h3>
            <p className="text-gray-500 text-sm">Owner, Carter Fitness Studio</p>
          </div>

          <div className="bg-[#29293f] p-6 rounded shadow">
            <p className="text-gray-400">
              "The real-time analytics and payment integration helped me track revenue effortlessly. Best decision for my business!"
            </p>
            <h3 className="mt-4 font-semibold text-pink-400">Akinola Nifemi</h3>
            <p className="text-gray-500 text-sm">Founder, Glow Salon</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-10 bg-[#121221] text-center">
        <h2 className="text-2xl font-bold text-pink-500">Schedulo</h2>
        <p className="mt-2 text-gray-400">Transforming Ideas into Digital Excellence.</p>
        <div className="mt-4 space-x-4">
          <Link to="/privacy-policy" className="hover:text-pink-400">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-pink-400">Terms of Use</Link>
        </div>
        <p className="mt-4 text-gray-500">© 2024 Schedulo. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
