"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would send the form data to a server
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    })
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-[#333333]">Contact Us</h1>
      
      <div className="content-section">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#555555] mb-6">
            We'd love to hear from you! Whether you have questions about a specific cheese, want to suggest additions to our database, 
            or are interested in collaborating with us, please don't hesitate to reach out.
          </p>
          
          <div className="bg-[#f9f5e7] p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-[#6b4c1e]">Email Us</h2>
            <p className="text-[#555555] mb-2">
              For general inquiries: <span className="font-medium">contact@qcheese.com</span>
            </p>
            <p className="text-[#555555] mb-2">
              For database corrections or additions: <span className="font-medium">database@qcheese.com</span>
            </p>
            <p className="text-[#555555]">
              For partnership opportunities: <span className="font-medium">partnerships@qcheese.com</span>
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-[#333333]">Contact Form</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-[#333333] font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c28135]" 
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-[#333333] font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c28135]" 
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-[#333333] font-medium mb-1">Subject</label>
                <select 
                  id="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c28135]"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="database">Database Addition/Correction</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Website Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-[#333333] font-medium mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={6} 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c28135]" 
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#333333]">Follow Us</h2>
            <p className="text-[#555555] mb-4">
              Stay updated with the latest cheese news, profiles, and pairings by following us on social media:
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#c28135] hover:text-[#6b4c1e]">Instagram</a>
              <a href="#" className="text-[#c28135] hover:text-[#6b4c1e]">Twitter</a>
              <a href="#" className="text-[#c28135] hover:text-[#6b4c1e]">Facebook</a>
              <a href="#" className="text-[#c28135] hover:text-[#6b4c1e]">Pinterest</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
