# Small Group Discussion

This is an experiment powered by [Empirica](https://empirica.ly/) as a follow-up for the model developed in
[Moussaïd M et al. (2018) Dynamical networks of influence in small group discussions](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0190541).

## Experiment Details:

### The task

In this experiment, groups of N=3 participants simultaneously undertake a visual perception task similar to the one implemented in [Moussaïd, et al. (2017). Reach and speed of judgment propagation in the laboratory, PNAS](http://www.pnas.org/content/early/2017/03/28/1611998114.short). Participants are exposed to visual stimuli consisting of a set of moving dots. A proportion of correlated dots move in a specific direction θ, and the remaining proportion of uncorrelated dots moved in random directions. Here, θ is the true value that participants have to estimate visually. The value of θ is the same for all the group members.

![task][task-img]

[task-img]: https://www.researchgate.net/profile/Jiaxiang_Zhang/publication/230624328/figure/fig1/AS:214158353145856@1428070738125/Schematic-diagram-of-the-RDM-stimulus-with-different-motion-coherence-levels-In-each.png

In the planned experiment, each group undertakes a series of “discussions” (each discussion is a `Round` from the point of view of Empirica). Within a given discussion round, the true value of θ remains unchanged. Each participant is given the chance to speak 3 times within a single discussion. Therefore, a single discussion round consists of 9 speaking stages (3 players each speaking 3 times), during which the participants share their current estimate with the rest of the group.

Calling A, B, and C the three participants. One discussion (the stimuli is always displayed on the participants’ screens) goes as follows:

1. Stage 1

- A, B, and C enter their estimate
- The estimate of A is displayed on all screens

2. Stage 2

- A, B, and C can revise their estimate
- The new estimate of B is displayed on all screens

3. Stage 3

- A, B, and C can again revise their estimate
- The estimate of C is displayed on all screens
  ...
  ...

9. Stage 9

- The experiment continues until stage 9 is reached (i.e., everyone spoke 3 times)...

10. Stage 10

- A summary of the scores that all participants have made in each stage is displayed on the screens.

11. A new discussion round (with a different true value θ) starts.

We set 9 speaking stages per discussion round and NR=20 discussion rounds per group.

### Speaking turns

The sequence of speaking turns determines which estimate is communicated at a given stage. It is generated using a simple random procedure: For each block of 3 stages, the speaking order is a random permutation of the 3 participants. That is, each participant speaks one and only one time in each block. With 9 speaking rounds, we have three blocks. Each participant thus speaks 3 times during the discussion round, as we mentioned earlier.

### Difficulty level

We vary the difficulty of the task between participants. That is, some group members will face an easy task — with a high proportion of correlated dots (e.g., 60%), whereas others will face a difficult task with a low proportion of correlated dots (e.g., 10%). The value of θ is the same for all the group members, irrespective of the difficulty level.

The difficulty level is fixed for the entire duration of the experiment.

## Experiment Demo:

You and a group of friends can play with this experiment as we ran it by following these instructions (assuming you have [Meteor installed](https://www.meteor.com/install)):

1. [Download](https://github.com/amaatouq/small-group-discussion) the repository (and unzip). Alternatively, from terminal just run:

```ssh
git clone https://github.com/amaatouq/small-group-discussion
```

2. Go into the folder with `cd small-group-discussion`
3. Install the required dependencies `meteor npm install`
4. Edit the `admin` password in the settings file `local.json` to something you like.
5. Run the local instance with `meteor --settings local.json`
6. Go to `http://localhost:3000/admin` (or whatever port you are running Meteor on).
7. login with the credentials username: `admin` and the password you have in `local.json`
8. Start a new batch with whatever configuration you want (see the example configuration).

### Example Config:

First, you have to enter the Configuration mode instead of the Monitoring model in the admin UI.

![config-mode][config-mode-image]

[config-mode-image]: ./readme_screenshots/configuration_mode.png

This will allow you to configure the experiment: Factors, Lobby, and Treatments:

![config-mode-inside][config-mode-inside-image]

[config-mode-inside-image]: ./readme_screenshots/configuration_mode_inside.png

Now, you have the option to create your own configuration (see below) or load an example configuration by clicking on `import` and then choosing the file `./example-config`.
Loading the example configurations will choose some example values for the factors (i.e., independent variables), lobby configuration, and few treatments.

The example factors will look like this:
![factors][factors-img]

[factors-img]: ./readme_screenshots/factors_example.png

And the example treatments will look like this:
![treatments][treatments-img]

[treatments-img]: ./readme_screenshots/treatments_example.png

Finally, you can go back to the Monitoring mode:

![monitoring-mode][monitoring-mode-image]

[monitoring-mode-image]: ./readme_screenshots/monitoring_mode.png

Now the **_Batchs_** tab make sure you add a new batch, add the treatments you want, choose your lobby configurations, and then **_start_** the batch.

![batches][batches-img]

[batches-img]: ./readme_screenshots/new_batch.png

Go to `http://localhost:3000/` and enjoy! If you don't have 3 friends to play with you, you always can use the `new player` button in development (for more details see this), which can add an arbitrary number players to the experiment while staying in the same browser (i.e., no need to open different browsers).

![game][game-img]

[game-img]: ./readme_screenshots/game.png

## Changing the experiment to make it your own

The experiment is built with Empirica, which is based on [Meteor](https://www.meteor.com/) web
development framework. In Empirica, the code is split in 2 main categories: code
running on the **client** (the browser) and code running on the **server**.
This functional separation is immediately reflected in the folders structure.

### Client

All code in the `/client` directory will be ran on the client. The entry point
for your app on the client can be found in `/client/main.js`. In there you will
find more details about how to customize how a game _Round_ should be rendered,
what _Consent_ message and which _Intro Steps_ you want to present the players
with, etc.

The HTML root of you app in `/client/main.html` shouldn't generally be changed
much, other than to update the app's HTML `<head>`, which contains the app's
title, and possibly 3rd party JS and CSS imports.

All styling starts in `/client/main.less`, and is written in
[LESS](http://lesscss.org/), a simple superset of CSS. You can also add a plain
CSS files in `/client`.

The `/client/game`, `/client/intro`, `/client/exit` directories all contain
[React](https://reactjs.org/) components, which compose the UI of your app.
If you are new to React, we recommend you try out the official
[React Tutorial](https://reactjs.org/tutorial/tutorial.html).

### Server

Server-side code all starts in the `/server/main.js` file. In that file, we set
an important Empirica integration point, the `Empirica.gameInit`, which allows
to configure each game as they are initiated by Empirica.

From there we import 2 other files. First the `/server/callback.js` file, which
contains all the possible callbacks used in the lifecycle of a game. These
callbacks, such as `onRoundEnd`, offer powerful ways to add logic to a game in a
central point (the server), which is often preferable to adding all the logic on
the client.

Finally, the `/server/bots.js` file is where you can add bot definitions
to your app.

### Public

The `/public` is here to host any static assets you might need in the game, such
as images. For example, if you add an image at `/public/my-logo.jpeg`, it will
be available in the app at `http://localhost:3000/my-logo.jpeg`.

### Settings

We generated a basic settings file (`/local.json`), which should originally only
contain configuration for admin login. More documentation for settings is coming
soon.

You can run the app with the settings like this:

```sh
meteor --settings local.json
```

## Updating Empirica Core

As new versions of Empirica become available, you might want to update the
version you are using in your app. To do so, simply run:

```sh
meteor update empirica:core
```

## Learn more

- Empirica Website: https://empirica.ly/
- Meteor Tutorial: https://www.meteor.com/tutorials/react/creating-an-app
- React Tutorial: https://reactjs.org/tutorial/tutorial.html
- LESS Intro: http://lesscss.org/#overview
- JavaScript Tutorial: https://javascript.info/
