# Martian Robots

A small program that works out where some robots end up after driving around a grid on
Mars. A robot that is told to drive off the edge is lost, but it leaves behind a "scent"
that stops later robots making the same mistake from the same square.

This is the classic Martian Robots exercise, written in TypeScript.

## Running it

You will need Node 22 or newer and npm. There is an `.nvmrc` if you use nvm.

```bash
npm install
npm start -- examples/sample-input.txt
```

That prints:

```
1 1 E
3 3 N LOST
2 3 S
```

You can also pipe the input in instead of passing a file:

```bash
cat examples/sample-input.txt | npm start
```

### Input format

The first line is the top right corner of the grid (the bottom left is always `0 0`). After
that, each robot takes two lines: where it starts and which way it faces, then the string of
moves it should make.

```
5 3
1 1 E
RFRFRFRF
```

`L` and `R` turn on the spot, `F` moves one square forward, and orientations are N, E, S and
W. The output is one line per robot with its final position, followed by the word `LOST` if
it drove off the edge (reported at the last square it was on).

## Running the tests

```bash
npm test
```

There is also `npm run typecheck`, `npm run lint` and `npm run format` if you want to check
the rest.

The tests concentrate on the parts of the problem that are easy to get wrong: a robot being
lost, a scent saving a later robot from the same fall, and a move being ignored because of a
scent. The sample from the brief is run end to end.

## How it is put together

```
src/
  domain/   the simulation itself, with no reading or writing of text
    orientations.ts   turning and moving
    commands.ts       the L, R and F commands
    simulate.ts       running a robot, including the scent and lost logic
  io/
    parse.ts          reading the text input (where the validation lives)
    format.ts         turning results back into text
  cli.ts    connects stdin or a file through to the output
```

I kept the simulation separate from anything that touches text. The domain code never deals
with strings and never throws. By the time a world reaches it the input has already been
checked, so it can just get on with running the robots.

## Decisions and trade-offs

**Adding new commands.** The brief mentions that more command types might show up later, so
the commands live in one small table in `commands.ts`. The set of valid letters and the
parser's check of them both come from that table, so adding a command is a single line and
nothing else needs to change. I stopped there rather than building anything fancier, because
that is all the problem asks for.

**Where "lost" is decided.** Each command only works out the robot's next position. The
runner is the one thing that knows about the grid: it applies a move and then checks whether
the robot fell off. Turning never changes the square, so a turn cannot get a robot lost
without that having to be a special case.

**Scents belong to a square, not an edge.** The brief talks about being lost "from a grid
point", so a scent protects a robot leaving that square in any direction. The sample does not
actually tell this apart from a per-edge rule, so if that assumption is wrong it is the first
thing I would change.

**Validation.** The parser rejects the things a person could realistically get wrong (an
unknown command, a bad orientation, a coordinate that is not a number, a robot starting off
the grid) and says what and where. The spec promises coordinates are at most 50 and move
strings are shorter than 100 characters, so I trusted that rather than checking it again.

**No build step.** It runs straight from the TypeScript with tsx, and `tsc` is used only to
type-check. A compile step would have been noise at this size.

## With more time

Per-edge scents behind a flag, a couple of property based tests (turning four times is a
no-op, a robot that survives never reports a square off the grid), and a small GitHub Actions
workflow to run the checks on every push.
