# Word Wok
Word-wok is the go-to content assistant for Square restaurant owners assiting the merchants/owners to quickly have their content idea on menu cards, using generative AI (Makersuite by Google).
Word-work provides an innovative way for these merchants to generate dish names and their descriptions with the magic of generative AI.

# Inspiration
While setting up a restaurant is an exhaustive task, it is definitely exciting. The next best and important thing that a customer notices after the ambience is the food menu card. Simplest way is to copy paste content online (food aggregator sites) or merchants could choose the modern innovative platform to help articulate the food description and name using Word Wok.

## Demo Video
Click here to view the demo video [youtube.com](youtube.com)

## Live Demo:
Visit [https://word-wok.coauth.dev](https://word-wok.coauth.dev) to try out

## Project Structure
Backend
- A NodeJS Express application based on Javascript that consumes Square Catalog APIs and MakerSuite APIs and exposes simple APIS to the word-wok frontend
- It also includes Square OAuth for merchant authentication

Frontend
- A Vite based VueJS application on Typescript that interacts with Backend for services

## Installation (Local Setup)
### Setup Pre-requisite (Square Setup)
1. Visit https://developer.squareup.com/us/en and create a developer account and login
2. Create App (https://developer.squareup.com/apps) and open the app
3. Go to OAuth menu section in left menu and add the following values in sandbox environment
4. Redirect URL: http://localhost:4000/api/auth/callback
5. Copy the Application ID and Application Secret
6. Click save on bottom right
7. Back in square developer console (home page) launch the dashboard and add some sample dishes under items

### Setup Pre-requisite (Google AI Makersuite)
1. Visit https://makersuite.google.com/ and create an API Key

### Setup Frontend
```ssh
git clone https://github.com/godwinpinto/word-wok.git

cd frontend

touch .env
```
- For values to be replaced in .env, refer to .env.example file
- Nothing to change for frontend here in local development
```ssh
npm run dev
``` 
- Your frontend should be started on http://localhost:5173

### Setup backend
```ssh
git clone https://github.com/godwinpinto/word-wok.git

cd backend

touch .env
```
- For values to be replaced in .env, refer to .env.example file
- SQ_ENVIRONMENT=sandbox
- DEPLOYMENT_MODE=LOCAL
```ssh
npm run server
```
- This will start you backend on http://localhost:4000

### Last Steps
- Launch chrome browser and login to https://developer.squareup.com/apps
- Open the sanbox developer test account and launch dashboard (this is required for sandbox accounts)
- In another browser tab, open http://localhost:5173 (i.e. word-wok frontend)
- You are now ready to start using word-wok
- Click signin  (follow demo video link provided above to start using)

## License
The project is released under MIT license. Repository link already included

## Bug Reporting / Feature request
Please create an issue to report a bug or new feature request

## Future plans for Word Wok
- [ ] AI auto-generate keywords (suggestions) for description screen
- [ ] Custom model for better precision of menu content from food ordering database
- [ ] Menu Card builder with Google AI Imagen to create a ready menu card that can simply be put to print
