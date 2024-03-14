"use client";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">
            Welcome to Flatfile! <br /> We&apos;re glad you&apos;re here! 🤩
          </h1>
          <p className="py-6">
            This app will show you a few examples of how to integrate Embedded
            Flatfile into your React workflow. First, we&apos;ll show you how to
            create a new Space every time Flatfile is opened. Then, we&apos;ll show
            you how to reuse a Space when Flatfile is opened.
          </p>
          <Link href="/new-space">
            <button className="btn btn-primary">
              Get Started Creating a New Space
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
