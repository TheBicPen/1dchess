# Draft Chess

## Usage

### Browser front-end
- Run `npm run start-server` to start listening
- Launch VSCode config `Launch Front-end`

### CLI front-end
This configuration has options for all types of games.

- Launch VSCode config `Launch Core CLI`

### Test core game functionality
- Launch VSCode config `Test Core`
- Read console output


## Design Notes

This project uses the MVC pattern. The model is in the `core` directory and is
shared by the browser front-end, CLI test front-end, and the (future) server.
The browser and CLI front-ends each have their own controllers.