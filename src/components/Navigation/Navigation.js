import { useState, useEffect, Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Input, 
  Textarea,
  Dialog,
DialogHeader,
DialogBody,
DialogFooter 
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
 
export default function Navigation() {
  const [openNav, setOpenNav] = useState(false);
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading  } = useAuth0();
  const [openPostModal, setOpenPostModal] = useState(false);
    const handleOpenPostModal = () => setOpenPostModal(!openPostModal);

    const handlePostUpdate = event => {
        event.preventDefault()
        const form = event.target
        const title = form.title.value;
        const description = form.description.value;
        const postObj = {
            userId: user?.sub.split('|')[1],
            title: title,
            description: description,
            likes: 0,
            comments: 0
        }
        fetch('https://dumsoc-server.vercel.app/post-update', {
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(postObj)
        })
        .then(response => response.json())
        .then(data => {
            if(data.acknowledged){
                form.reset()
                setOpenPostModal(!openPostModal)
                toast.success('Post added successfully')
            }
            else{
                setOpenPostModal(!openPostModal)
                toast.error('Something went wrong')
            }
        })
    }
 
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
 
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1"
      >
        <NavLink onClick={handleOpenPostModal} className="flex items-center font-semibold">
          Add a Post
        </NavLink>
      </Typography>
    </ul>
  );
 
  return (
      <Fragment>
          
    <Navbar className="mx-auto py-2 px-4 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="small"
          className="mr-4 cursor-pointer py-1.5 font-normal"
        >
          <span className="text-lg font-bold">DumSoc</span>
        </Typography>
        <div className="hidden lg:block">{navList}</div>
        {
            isAuthenticated?<Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} variant="gradient" size="sm" className="hidden lg:inline-block rounded-sm">
            <span>Logout</span>
          </Button>:<Button onClick={() => loginWithRedirect()} variant="gradient" size="sm" className="hidden lg:inline-block rounded-sm">
            <span>Login</span>
          </Button>
        }
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          {navList}
          {isAuthenticated?<Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} variant="gradient" size="sm" fullWidth className="mb-2">
            <span>Logout</span>
          </Button>:<Button onClick={() => loginWithRedirect()} variant="gradient" size="sm" fullWidth className="mb-2">
            <span>Login</span>
          </Button>}
        </div>
      </MobileNav>
    </Navbar>
  {
      user?<Dialog
      open={openPostModal}
      handler={handleOpenPostModal}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="min-w-[90%] md:min-w-[40%]"
    >
      <DialogHeader>Post an Update</DialogHeader>
      <form onSubmit={handlePostUpdate}>
      <DialogBody className="grid grid-cols-1 gap-y-2">
        <Input label="Post Title" id="title" className="max-w-full block mb-3"/>
        <Textarea label="Description" id="description" className='max-w-full'/>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          size="sm"
          onClick={handleOpenPostModal}
          className="mr-1 rounded-sm"
        >
          <span>Cancel</span>
        </Button>
        <Button size='sm' className='rounded-sm' type="submit">Post</Button>
      </DialogFooter>
      </form>
    </Dialog>:toast.error('You need to login first')
  }
      </Fragment>
  );
}