import express, { Request, Response, NextFunction } from 'express';
import { GdriveHelper } from './GdriveHelper';
import { get_file_query, get_movie_query, get_series_query } from './Querymaker';
import * as jwt from 'jsonwebtoken';
import { processResults } from './utils';
import { GenericResponse, MovieSearchResponse, SeriesSearchQueryParams, signinInputs, signupInputs } from './types';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { MovieSearchQueryParams } from './types';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app = express();
const PORT = 3001;
const gd = new GdriveHelper();



// TODO: paginated responses
app.use(cors())
app.use(express.json());
app.use(cookieParser());


const jwtAuthenication = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        console.log("Token not found");
        res.status(401).send({
            msg: "Not Authenticated"
        })
        return;
    }
    try {
        const payload = <any>jwt.verify(token.split(" ")[1], <jwt.Secret>process.env.secret);
        next();
    } catch (err) {
        res.status(401).send({
            msg: "Invalid jwt token"
        });
    }
}



app.get('/ping', jwtAuthenication, (req: Request, res: Response) => {
    res.send("Pong")
    return
})

app.post('/signup', async (req: Request, res: Response) => {
    const parsedInput = signupInputs.safeParse(req.query);
    if (!parsedInput.success) {
        res.send({
            msg: "Wrong inputs", 
            err: parsedInput.error}
            );
        return;
    }
    const userDetails = parsedInput.data;
    if(userDetails.token !== process.env.SIGNUP_TOKEN){
        return res.status(403).send({
            msg: "Invalid invitation token"
        });
    }
    const userExist = await prisma.user.findFirst({
        where:{
            username: userDetails.username
        }
    })
    if (userExist) {
        res.status(403).send({
            msg: "user already h be"
        });
        return;
    }
    prisma.user.create({
        data: {
            name: userDetails.name!,
            email: userDetails.email!,
            password: userDetails.password!,
            token: userDetails.token!,
            username: userDetails.username!
        }
    })
    .then(()=>{
        return res.send({
            msg: "user created"
        });
    })
    .catch(()=>{
        return res.status(403).send({
            msg: "can not create user"
        })
    })

    
});

app.post('/login', async (req: Request, res: Response) => {
    const parsedInput = signinInputs.safeParse(req.query);
    if (!parsedInput.success) {
        res.send({
            msg: "Wrong inputs", 
            err: parsedInput.error}
            );
        return;
    }
    const { username, password } = parsedInput.data;
    const user = await prisma.user.findFirst({
        where:{
            username: username
        }
    })
    if (!user || user?.password !== password) {
        res.status(401).send({
            msg: "Authenication Failed!"
        });
        return;
    }
    const token = jwt.sign({ username: user.username }, <jwt.Secret>process.env.secret, {
        expiresIn: "30d"
    });
    res.cookie("Authorization", "Bearer " + token)
    res.status(200).send({
        msg: "Authenticated Successfully",
        token: token
    });
    return;
});


app.get('/movies', jwtAuthenication, async (req: Request, res: Response<MovieSearchResponse>) => {
    let movie = <MovieSearchQueryParams>req.query
    let queries = get_movie_query(movie)
    let prs = queries.map((q) => gd.searchFiles(q));
    let result = await Promise.all(prs);
    let files = processResults(result);
    return res.send({
        msg: "success",
        len: files.length,
        data: files
    });
});

app.get('/series', jwtAuthenication, async (req: Request, res: Response<GenericResponse>) => {
    let series = <SeriesSearchQueryParams>req.query
    let queries = get_series_query(series)
    let prs = queries.map((q) => gd.searchFiles(q));
    let result = await Promise.all(prs);
    let files = processResults(result);
    return res.send({
        msg: "success",
        len: files.length,
        data: files
    });
});


app.get('/files', jwtAuthenication, async (req: Request, res: Response) => {
    let queries = get_file_query(<string>req.query.name);
    let prs = queries.map((q) => gd.searchFiles(q))
    let result = await Promise.all(prs);
    let files = processResults(result);
    return res.send({
        msg: "success",
        len: files.length,
        data: files
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});