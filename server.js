#include <SDL2/SDL.h>
#include <SDL2/SDL_opengl.h>
#include <SDL2/SDL_mixer.h>
#include <cmath>
#include <vector>

float camZ = 5;
float camRot = 0;

bool knifeOpen = false;
float bladeAngle = 0;

Mix_Chunk* knifeSound = nullptr;

struct Enemy {
    float x, z;
};

std::vector<Enemy> enemies = {
    { -3, -5 },
    { 2, -8 },
    { 5, -4 }
};

void drawCube(float w, float h, float d) {
    glBegin(GL_QUADS);

    // Front
    glVertex3f(-w, 0, d);
    glVertex3f(w, 0, d);
    glVertex3f(w, h, d);
    glVertex3f(-w, h, d);

    // Back
    glVertex3f(-w, 0, -d);
    glVertex3f(w, 0, -d);
    glVertex3f(w, h, -d);
    glVertex3f(-w, h, -d);

    glEnd();
}

void drawHuman() {
    // Body
    glColor3f(0.2f, 0.6f, 0.8f);
    drawCube(0.2f, 0.8f, 0.15f);

    // Head
    glPushMatrix();
    glTranslatef(0, 0.9f, 0);
    glColor3f(1.0f, 0.8f, 0.6f);
    drawCube(0.15f, 0.2f, 0.15f);

    // Hair
    glTranslatef(0, 0.15f, 0);
    glColor3f(0.1f, 0.1f, 0.1f);
    drawCube(0.16f, 0.05f, 0.16f);
    glPopMatrix();
}

void drawEnemies() {
    for (auto& e : enemies) {
        glPushMatrix();
        glTranslatef(e.x, -1, e.z);
        drawHuman();
        glPopMatrix();
    }
}

void drawStreet() {
    glColor3f(0.3f, 0.3f, 0.3f);
    for (int x = -20; x < 20; x += 3) {
        for (int z = -20; z < 20; z += 3) {
            glPushMatrix();
            glTranslatef(x, -1.5f, z);
            drawCube(1, 0.1f, 1);
            glPopMatrix();
        }
    }
}

void drawKnife() {
    glPushMatrix();
    glLoadIdentity();
    glTranslatef(0.4f, -0.4f, -1);

    // Handle
    glColor3f(0.3f, 0.2f, 0.1f);
    glBegin(GL_QUADS);
    glVertex3f(-0.1f, -0.05f, 0);
    glVertex3f(0.1f, -0.05f, 0);
    glVertex3f(0.1f, 0.05f, 0);
    glVertex3f(-0.1f, 0.05f, 0);
    glEnd();

    // Blade
    glRotatef(bladeAngle, 0, 1, 0);
    glColor3f(0.8f, 0.8f, 0.8f);
    glBegin(GL_TRIANGLES);
    glVertex3f(0, 0, 0);
    glVertex3f(0.6f, 0.04f, 0);
    glVertex3f(0.6f, -0.04f, 0);
    glEnd();

    glPopMatrix();
}

int main() {
    SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO);
    Mix_OpenAudio(44100, MIX_DEFAULT_FORMAT, 2, 2048);

    knifeSound = Mix_LoadWAV("knife.wav");

    SDL_Window* window = SDL_CreateWindow(
        "FPS Knife Fight",
        SDL_WINDOWPOS_CENTERED,
        SDL_WINDOWPOS_CENTERED,
        800, 600,
        SDL_WINDOW_OPENGL
    );

    SDL_GLContext glContext = SDL_GL_CreateContext(window);
    SDL_SetRelativeMouseMode(SDL_TRUE);

    glEnable(GL_DEPTH_TEST);

    bool running = true;
    SDL_Event e;

    while (running) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_QUIT)
                running = false;

            if (e.type == SDL_MOUSEMOTION)
                camRot += e.motion.xrel * 0.1f;

            if (e.type == SDL_KEYDOWN && e.key.keysym.sym == SDLK_f) {
                knifeOpen = !knifeOpen;
                Mix_PlayChannel(-1, knifeSound, 0);
            }
        }

        if (knifeOpen && bladeAngle < 90) bladeAngle += 5;
        if (!knifeOpen && bladeAngle > 0) bladeAngle -= 5;

        glClearColor(0.1f, 0.1f, 0.15f, 1);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        glMatrixMode(GL_PROJECTION);
        glLoadIdentity();
        gluPerspective(70, 800.0 / 600.0, 0.1, 100);

        glMatrixMode(GL_MODELVIEW);
        glLoadIdentity();

        glRotatef(camRot, 0, 1, 0);
        glTranslatef(0, 0, -camZ);

        drawStreet();
        drawEnemies();
        drawKnife();

        SDL_GL_SwapWindow(window);
        SDL_Delay(16);
    }

    Mix_FreeChunk(knifeSound);
    Mix_CloseAudio();
    SDL_Quit();
    return 0;
}



sudo apt install libsdl2-dev libsdl2-mixer-dev libgl1-mesa-dev libglu1-mesa-dev


g++ main.cpp -lSDL2 -lSDL2_mixer -lGL -lGLU -o game
./game