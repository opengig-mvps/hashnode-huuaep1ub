'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Star, User } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-50">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 bg-yellow-100">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-extrabold text-yellow-800 tracking-tighter sm:text-6xl">
                  Share Your Stories
                </h1>
                <p className="text-lg text-yellow-700 max-w-lg">
                  Discover, create, and share amazing blog posts. Engage with a community of thinkers and writers.
                </p>
                <div className="flex space-x-4">
                  <Button className="bg-yellow-600 text-white hover:bg-yellow-500">
                    Start Writing
                  </Button>
                  <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-100">
                    Explore Blogs
                  </Button>
                </div>
              </div>
              <img
                src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
                alt="Blogging"
                className="rounded-lg shadow-lg object-cover h-full"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-yellow-800 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <div className="grid gap-8 mt-12 lg:grid-cols-3">
              <Card className="p-6 bg-white shadow-md">
                <User className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-800">Create</h3>
                <p className="text-yellow-700">
                  Write engaging blogs and reach a wider audience effortlessly.
                </p>
              </Card>
              <Card className="p-6 bg-white shadow-md">
                <MessageSquare className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-800">Engage</h3>
                <p className="text-yellow-700">
                  Start discussions and receive feedback from a vibrant community.
                </p>
              </Card>
              <Card className="p-6 bg-white shadow-md">
                <Heart className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-800">Connect</h3>
                <p className="text-yellow-700">
                  Like and share posts that resonate with you, connect with like-minded people.
                </p>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 bg-yellow-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-yellow-800 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="mt-12">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create a blog post?</AccordionTrigger>
                <AccordionContent>
                  Start by signing up or logging in, then navigate to the 'Create' section to write and publish your post.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I comment on blogs?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! Engage with authors by leaving comments and feedback on their posts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it free to use?</AccordionTrigger>
                <AccordionContent>
                  Yes, our platform is free to use for readers and writers alike.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-yellow-800 sm:text-4xl">
              What Our Users Say
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-medium text-yellow-800">Jane Doe</p>
                    <p className="text-sm text-yellow-700">Blogger</p>
                  </div>
                </div>
                <p className="text-yellow-700">
                  "This platform has been a game-changer for my blogging journey!"
                </p>
              </Card>
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-medium text-yellow-800">Alice Brown</p>
                    <p className="text-sm text-yellow-700">Reader</p>
                  </div>
                </div>
                <p className="text-yellow-700">
                  "I love the diversity of content and the interaction with other users."
                </p>
              </Card>
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-medium text-yellow-800">Mark Smith</p>
                    <p className="text-sm text-yellow-700">Writer</p>
                  </div>
                </div>
                <p className="text-yellow-700">
                  "Engaging with my audience has never been easier!"
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-yellow-200 p-6">
        <div className="container mx-auto text-center">
          <p className="text-yellow-800">&copy; 2023 BlogSite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;