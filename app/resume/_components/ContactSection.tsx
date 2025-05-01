'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/SectionContainer";

const phoneNumber = '+919782353866';
const message = 'Hello! I want to chat with you.';
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

const handleClick = () => {
  window.open(whatsappUrl, '_blank');
};


export function ContactSection({
  title = "Contact",
  phone = "+91 9782353866",
  email = "rameshsuthar32@gmail.com",
  imageSrc = "/office.jpg",
  introText = "If you are interested in learning more about my work, discussing a potential project, or have any questions or comments, please feel free to contact me using the following information:",
  outro = "I look forward to hearing from you and the opportunity to collaborate on your next project.",
  buttonText = "Send a Message",
  className,
  ...props
}: {
  title?: string;
  phone?: string;
  email?: string;
  imageSrc?: string;
  introText?: string;
  outro?: string;
  buttonText?: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <SectionContainer className={className} {...props}>
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="space-y-4 leading-relaxed">
            <p>{introText}</p>
            <p>
              <span className="font-semibold">Tel:</span> {phone}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {email}
            </p>
            <p>{outro}</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={handleClick}>
            {buttonText}
          </Button>
        </div>

        {/* Image */}
        <div className="w-full h-full">
          <div className="w-full h-[500px]">
            <Image
              src={imageSrc}
              alt="Contact Illustration"
              className="w-full h-full object-cover rounded-md"
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}