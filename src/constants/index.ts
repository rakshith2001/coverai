export const navLinks = [
    {
      label: "Generate Resume",
      route: "/",
      icon: "/assets/icons/home.svg",
    },
    {
      label: "Profile",
      route: "/transformations/add/Profile",
      icon: "/assets/icons/image.svg",
    },
    {
      label: "Buy Credits",
      route: "/credits",
      icon: "/assets/icons/bag.svg",
    },
    {
      label: "User",
      route: "/user",
      icon: "/assets/icons/image.svg",
    },
  ];
  
  export const plans = [
    {
      _id: 1,
      name: "Standard Package",
      icon: "/assets/icons/free-plan.svg",
      price: 10,
      credits: 40,
      inclusions: [
        {
          label: "20 Free Credits",
          isIncluded: true,
        },
        {
          label: "Basic Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: false,
        },
        {
          label: "Priority Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 2,
      name: "Pro Package",
      icon: "/assets/icons/free-plan.svg",
      price: 20,
      credits: 100,
      inclusions: [
        {
          label: "120 Credits",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 3,
      name: "Premium Package",
      icon: "/assets/icons/free-plan.svg",
      price: 50,
      credits: 300,
      inclusions: [
        {
          label: "2000 Credits",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: true,
        },
      ],
    },
  ];
  interface TransformationType {
    type: string;
    title: string;
    subTitle: string;
    config: {
      restore: boolean;
    };
    icon: string;
  }
  
  export const transformationTypes: { [key: string]: TransformationType } = {
    Profile: {
      type: "profile",
      title: "Add Profile",
      subTitle: "Add a profile to generate the resume!",
      config: { restore: true },
      icon: "image.svg",
    },
  };
  
  export const aspectRatioOptions = {
    "1:1": {
      aspectRatio: "1:1",
      label: "Square (1:1)",
      width: 1000,
      height: 1000,
    },
    "3:4": {
      aspectRatio: "3:4",
      label: "Standard Portrait (3:4)",
      width: 1000,
      height: 1334,
    },
    "9:16": {
      aspectRatio: "9:16",
      label: "Phone Portrait (9:16)",
      width: 1000,
      height: 1778,
    },
  };
  
  export const defaultValues = {
    name: "",
    workExperience: "",
    description: "",
    publicId: "",
  };
  
  export const creditFee = -1;

