import { createUser } from "./users.js"

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Blogs Api",
        version: "1.0.0",
        description: "Blogs, Messages and User apis",
        contact: {
          name: "Mugisha Jedidiah Eddy", 
          email: "eddymugisha65@gmail.com", 
          url: "web.com",
        },
      },
      servers: [
        {
          url: 'http://localhost:5000/',
          description: 'Local Server',
        },
        {
          url: 'https://my-brand-production.up.railway.app/',
          description: 'Api Link',
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: ['src/routes/users.js', 'src/routes/blogs.js', 'src/routes/messages.js'],
}

export default options