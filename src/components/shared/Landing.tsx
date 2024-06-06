import { navLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"

const Landing = () => {
    
  return (
    <>
    <section className="home">
        <h1 className="home-heading">
          Create Cover Letter In an Instant!
        </h1>
        <p className="home-subheading">
          Tired of writing cover letters? Let our AI powered tool do the work for you.
        </p>
      </section>

    <div className="flex flex-col h-screen bg-gray-100">
          <div className="flex flex-col flex-grow bg-white p-4">
            <div className="flex flex-col flex-grow items-center justify-center">
              <h1 className="text-2xl font-semibold">Sign in to Create Cover Letter</h1>
            </div>
          </div>
    </div>
    </>
  )
}

export default Landing