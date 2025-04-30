'use client';
import { PageLayout } from "@/components/PageLayout";
import { Separator } from "@/components/ui/separator";
import { ResumeSection } from "./_components/ResumeSection";
import { ContactSection } from "./_components/ContactSection";

export default function Resume() {
    return (
        <PageLayout>
            <Separator className="my-8" />

            {/* Resume Section */}
            <ResumeSection
                title="Resume"
                education={[
                    { label: "Master's degree", value: "2018–19" },
                    { label: "Bachelor's degree", value: "2014–19" },
                    { label: "High School", value: "2010–14" }
                ]}
                skills={[
                    { label: "Revit", value: "Expert" },
                    { label: "ArchiCAD", value: "Intermediate" },
                    { label: "Adobe Creative Suite", value: "Intermediate" }
                ]}
                experience={[
                    { label: "Passion for design", value: "3D rendering" },
                    { label: "Attention to detail", value: "Problem solving" },
                    { label: "Critical thinking", value: "Project management" }
                ]}
            />

            <Separator className="my-12" />

            <ContactSection
                title="Contact"
                phone="+91 78777132244"
                email="hariomsuthar7143@gmail.com"
                imageSrc="/office.jpg"
                introText="If you are interested in learning more about my work, discussing a potential project, or have any questions or comments, please feel free to contact me using the following information:"
                outro="I look forward to hearing from you and the opportunity to collaborate on your next project."
                buttonText="Send a Message"
            />
        </PageLayout>
    );
}
