'use babel';

import { join } from 'path';
import { remove } from 'fs-extra';

const validPath = join(__dirname, 'fixtures', 'valid.ex');
const warningPath = join(__dirname, 'fixtures', 'proj', 'lib', 'proj.ex');
const errorMode1Path = join(__dirname, 'fixtures', 'error-mode1.ex');
const errorMode2Path = join(__dirname, 'fixtures', 'error-mode2.ex');
const exsFilePath = join(__dirname, 'fixtures', 'script.exs');

const mixBuildDirectory = join(__dirname, 'fixtures', 'proj', '_build');
remove(mixBuildDirectory);

describe('The elixirc provider for Linter', () => {
  describe('when using the standard configuration', () => {
    let lint;

    beforeEach(() => {
      atom.config.set('linter-elixirc.forceElixirc', false);
      lint = require('../lib/init.js').provideLinter().lint;
      atom.workspace.destroyActivePaneItem();

      waitsForPromise(() =>
        Promise.all([
          atom.packages.activatePackage('linter-elixirc'),
          atom.packages.activatePackage('language-elixir'),
        ]),
      );
    });

    it('works with mode 1 errors', () => {
      waitsForPromise(() =>
        atom.workspace.open(errorMode1Path).then(editor => lint(editor)).then((messages) => {
          expect(messages.length).toBe(1);
          expect(messages[0].severity).toBe('error');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].excerpt).toBe('(ArgumentError) Dangerous is not available');
          expect(messages[0].location.file).toBe(errorMode1Path);
          expect(messages[0].location.position).toEqual([[1, 0], [1, 32]]);
        }),
      );
    });

    it('works with mode 1 errors for elixirc', () => {
      waitsForPromise(() =>
        atom.workspace.open(errorMode1Path).then(editor => lint(editor)).then((messages) => {
          expect(messages.length).toBe(1);
          expect(messages[0].severity).toBe('error');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].excerpt).toBe('(ArgumentError) Dangerous is not available');
          expect(messages[0].location.file).toBe(errorMode1Path);
          expect(messages[0].location.position).toEqual([[1, 0], [1, 32]]);
        }),
      );
    });

    it('works with mode 2 errors', () => {
      waitsForPromise(() =>
        atom.workspace.open(errorMode2Path).then(editor => lint(editor)).then((messages) => {
          expect(messages.length).toBe(1);
          expect(messages[0].severity).toBe('error');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].excerpt).toBe('(CompileError) module Usefulness is not loaded and could not be found');
          expect(messages[0].location.file).toBe(errorMode2Path);
          expect(messages[0].location.position).toEqual([[3, 2], [3, 20]]);
        }),
      );
    });

    it('works with warnings', () => {
      waitsForPromise(() =>
        atom.workspace.open(warningPath).then(editor => lint(editor)).then((messages) => {
          expect(messages.length).toBe(1);
          expect(messages[0].severity).toBe('warning');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].excerpt).toBe('variable "prepare_for_call" does not exist and is being expanded to "prepare_for_call()", please use parentheses to remove the ambiguity or change the variable name');
          expect(messages[0].location.file).toBe(warningPath);
          expect(messages[0].location.position).toEqual([[20, 4], [20, 20]]);
        }),
      );
    });

    it('works with .exs files', () => {
      waitsForPromise(() =>
        atom.workspace.open(exsFilePath).then(editor => lint(editor)).then((messages) => {
          expect(messages.length).toBe(1);
          expect(messages[0].severity).toBe('warning');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].excerpt).toBe('function simple_function/0 is unused');
          expect(messages[0].location.file).toBe(exsFilePath);
          expect(messages[0].location.position).toEqual([[1, 2], [1, 25]]);
        }),
      );
    });

    it('finds nothing wrong with a valid file', () => {
      waitsForPromise(() =>
        atom.workspace.open(validPath).then(editor => lint(editor)).then((messages) => {
          expect(messages.length).toBe(0);
        }),
      );
    });
  });
});

describe('when using the setting forceElixirc', () => {
  let lint;

  beforeEach(() => {
    atom.config.set('linter-elixirc.forceElixirc', true);
    lint = require('../lib/init.js').provideLinter().lint;
    atom.workspace.destroyActivePaneItem();

    waitsForPromise(() =>
      Promise.all([
        atom.packages.activatePackage('linter-elixirc'),
        atom.packages.activatePackage('language-elixir'),
      ]),
    );
  });

  it('works with mode 1 errors for elixirc', () => {
    waitsForPromise(() =>
      atom.workspace.open(errorMode1Path).then(editor => lint(editor)).then((messages) => {
        expect(messages.length).toBe(1);
        expect(messages[0].severity).toBe('error');
        expect(messages[0].html).not.toBeDefined();
        expect(messages[0].excerpt).toBe('(ArgumentError) Dangerous is not available');
        expect(messages[0].location.file).toBe(errorMode1Path);
        expect(messages[0].location.position).toEqual([[1, 0], [1, 32]]);
      }),
    );
  });
});
