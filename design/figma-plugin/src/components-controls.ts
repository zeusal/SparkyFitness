// Controls: buttons, inputs, selection controls, chips and badges.
// Every value comes from SparkyFitnessMobile/DESIGN.md section 4 and the components it names:
// ui/Button.tsx, FormInput.tsx, LibrarySearchBar.tsx, StepperInput.tsx, SegmentedControl.tsx,
// ui/Switch.tsx, BottomSheetPicker.tsx (PickerTrigger), HydrationGauge.tsx (container chips),
// FoodSummary.tsx (meal calorie chip), AiEstimateBadge.tsx, AllergenBadges.tsx and the
// `px-2 py-0.5 rounded-md` tag badges (ActiveWorkoutGuidedCard, WorkoutCompleteWodCard).
//
// React Native draws a 1px border inside the box but adds it to the layout size, so a
// bordered control is 2px larger than its padding suggests. Figma strokes here are INSIDE,
// so bordered controls use padding + 1 to keep the app's real size (FormInput is 42pt tall).

import {
  COMPONENT_CATALOG,
  add,
  board,
  caption,
  component,
  divider,
  effect,
  ellipse,
  frame,
  icon,
  instance,
  paint,
  rect,
  section,
  setFrameTheme,
  single,
  solid,
  specimen,
  text,
  variantSet,
  type Pad,
  type TextOpts,
  type ThemeName,
  type Weight,
} from './core';

const WHITE = '#FFFFFF';
const PILL = 999;
/** Width of a phone content column: 375pt screen minus two 16px gutters. */
const COLUMN = 343;
/** Width used for full-width field specimens so three fit across a board. */
const FIELD_W = 320;
/** Boards are 1280 wide so three phone-width (343pt) examples fit in one usage row. */
const BOARD_W = 1280;

type Catalog = typeof COMPONENT_CATALOG;
type ButtonVariant = Catalog['Button']['Variant'][number];
type ButtonState = Catalog['Button']['State'][number];
type TextFieldState = Catalog['Text Field']['State'][number];
type SearchState = Catalog['Search Field']['State'][number];
type StepperSize = Catalog['Stepper']['Size'][number];
type ChipStyle = Catalog['Chip']['Style'][number];
type SwitchOn = Catalog['Switch']['On'][number];
type PickerState = Catalog['Picker Trigger']['State'][number];
type AllergenStrength = Catalog['Allergen Chip']['Strength'][number];
type SegmentCount = Catalog['Segmented Control']['Segments'][number];
type SegmentIndex = Catalog['Segmented Control']['Selected'][number];

// ---------------------------------------------------------------- local helpers

/** Text in a token color, or fixed white when ink is null (allowed on accent and danger fills only). */
function inkText(content: string, ink: string | null, opts: TextOpts): TextNode {
  const t = text(content, { ...opts, color: ink });
  if (ink === null) t.fills = [solid(WHITE)];
  return t;
}

/** Icon in a token color, or fixed white when ink is null. */
function inkIcon(name: string, size: number, ink: string | null): InstanceNode {
  return ink === null ? icon(name, size, null, WHITE) : icon(name, size, ink);
}

/** An icon that is part of the control, not its swappable slot (core only exposes layers named "Icon"). */
function glyph(name: string, size: number, ink: string, layerName: string): InstanceNode {
  const i = icon(name, size, ink);
  i.name = layerName;
  return i;
}

/** Text cursor in the iOS tint color (Sparky Blue). */
function caret(height = 20): RectangleNode {
  const r = rect(2, height, 'accent-primary', 1);
  r.name = 'Caret';
  return r;
}

/**
 * Small activity indicator: a 16px ring arc (2px thick) on a faint track, centered in a 24px box
 * so the button keeps its 52pt height when the label is swapped out. ink null = white.
 */
function spinner(ink: string | null): FrameNode {
  const box = frame({ name: 'Spinner', width: 24, height: 24 });
  const trackRing = ellipse(16, null);
  trackRing.name = 'Track';
  trackRing.arcData = { startingAngle: 0, endingAngle: 2 * Math.PI, innerRadius: 0.75 };
  trackRing.fills = [ink === null ? solid(WHITE, 0.3) : paint(ink, 0.25)];
  add(box, trackRing, { absolute: { x: 4, y: 4 } });
  const arc = ellipse(16, null);
  arc.name = 'Arc';
  arc.arcData = { startingAngle: 0, endingAngle: 1.5 * Math.PI, innerRadius: 0.75 };
  arc.fills = [ink === null ? solid(WHITE) : paint(ink)];
  add(box, arc, { absolute: { x: 4, y: 4 } });
  return box;
}

/** A card-like container for usage examples (Porcelain Card, 16px radius, shadow-sm). */
function demoCard(name: string, width = COLUMN, gap = 12, pad: Pad = 16): FrameNode {
  const f = frame({ name, dir: 'V', gap, pad, fill: 'surface', radius: 16, width });
  effect(f, 'Elevation/Card (shadow-sm)');
  return f;
}

/** A transparent fixed-width column for examples that sit straight on the canvas. */
function demoColumn(name: string, width = COLUMN, gap = 12): FrameNode {
  return frame({ name, dir: 'V', gap, width });
}

/** Adds an "Usage" block (overline, one-line note, wrapping row) to a section and returns the row. */
function usageRow(content: FrameNode, note: string): FrameNode {
  const wrap = frame({ name: 'Usage', dir: 'V', gap: 12 });
  add(content, wrap, { h: 'FILL' });
  // Uppercase is written into the characters: linking a text style resets textCase.
  add(wrap, text('USAGE', { role: 'Overline/Default', color: 'text-muted' }));
  add(wrap, text(note, { role: 'Body/Default', color: 'text-secondary' }), { h: 'FILL' });
  const row = frame({ name: 'Examples', dir: 'H', gap: 40, wrap: true });
  add(wrap, row, { h: 'FILL' });
  return row;
}

/** Sets a BOOLEAN component property on an instance by its friendly name. */
function setBool(inst: InstanceNode, prop: string, value: boolean): void {
  const key = Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === prop);
  if (key) inst.setProperties({ [key]: value });
}

/** Adds a row of field label + control, the way forms stack them (label `mb-1.5` above). */
function labelled(parent: FrameNode, label: string, control: SceneNode): void {
  const group = frame({ name: label, dir: 'V', gap: 6 });
  add(parent, group, { h: 'FILL' });
  add(group, text(label, { role: 'Body/Field label', color: 'text-secondary' }));
  add(group, control, { h: 'FILL' });
}

// ---------------------------------------------------------------- Buttons

interface ButtonLook {
  fill: string | null;
  stroke?: string;
  radius: number;
  /** Label and icon color token; null = white on the accent fill. */
  ink: string | null;
  weight: Weight;
  spec: string;
}

const BUTTON_LOOK: Record<ButtonVariant, ButtonLook> = {
  Primary: { fill: 'accent-primary', radius: 16, ink: null, weight: 'Semi Bold', spec: 'Sparky Blue fill, white 16px semibold label. The default variant.' },
  Secondary: { fill: 'raised', radius: 16, ink: 'accent-primary', weight: 'Semi Bold', spec: 'Bright Control Fill, no border, Sparky Blue semibold label.' },
  Outline: { fill: null, stroke: 'accent-primary', radius: 16, ink: 'accent-primary', weight: 'Semi Bold', spec: 'Transparent, 1px Sparky Blue border and label (2pt taller: RN adds the border).' },
  Ghost: { fill: null, radius: 16, ink: 'accent-primary', weight: 'Semi Bold', spec: 'Transparent, Sparky Blue label. Also the inline-link idiom with py-0 px-0.' },
  Link: { fill: null, radius: 0, ink: 'text-link', weight: 'Semi Bold', spec: 'Transparent, Link Blue semibold label, no radius.' },
  Destructive: { fill: null, radius: 16, ink: 'icon-danger', weight: 'Medium', spec: 'Transparent, Danger Glyph medium label. Never a red fill.' },
};

const BUTTON_W = 200;

function buttonVariant(v: ButtonVariant, s: ButtonState): ComponentNode {
  const look = BUTTON_LOOK[v];
  const border = look.stroke ? 1 : 0;
  const opacity = s === 'Pressed' ? 0.8 : s === 'Default' ? 1 : 0.5;
  return component(
    `Variant=${v}, State=${s}`,
    {
      dir: 'H',
      gap: 8,
      pad: { x: 16 + border, y: 14 + border },
      align: 'CENTER',
      cross: 'CENTER',
      fill: look.fill,
      stroke: look.stroke,
      radius: look.radius,
      width: BUTTON_W,
      opacity,
    },
    (c) => {
      if (s === 'Loading') {
        // The app always draws a white spinner (DESIGN.md section 8); on transparent variants
        // that is invisible in Light, so the spec uses the label color there.
        add(c, spinner(look.ink));
        return;
      }
      const lead = inkIcon('add', 20, look.ink);
      lead.visible = false;
      add(c, lead);
      const labelOpts: TextOpts =
        look.weight === 'Semi Bold'
          ? { role: 'Label/Button', name: 'Label' }
          : { size: 16, lineHeight: 24, weight: look.weight, name: 'Label' };
      add(c, inkText('Button', look.ink, labelOpts));
    }
  );
}

/** BOOLEAN "Show icon" that toggles the hidden leading icon slot (white 18–20px on primary). */
function addIconToggle(set: ComponentSetNode): void {
  const key = set.addComponentProperty('Show icon', 'BOOLEAN', false);
  const slots = set.findAll((n) => n.type === 'INSTANCE' && n.name === 'Icon') as InstanceNode[];
  for (const s of slots) {
    s.componentPropertyReferences = { ...(s.componentPropertyReferences ?? {}), visible: key };
  }
}

function buildButtons(): FrameNode {
  const { root, body } = board(
    'Buttons',
    'Button (ui/Button.tsx) has seven variants; six are drawn here (header is a bare text action in the top bar). All have 14px vertical and 16px horizontal padding, centered content and a 16px label, so a single-line button is about 52pt tall; all but Link have 16px corners. Pressed lowers opacity to 80%; Disabled and Loading set 50%, and Loading swaps the label for a small spinner. There is no scale, ripple or hover effect.',
    BOARD_W
  );

  const content = section(
    body,
    'Button',
    'Variant × State. Label is a text property; "Show icon" reveals a leading 20px icon (swap it with the Icon property). Specimens are 200pt wide; set instances to Fill in footers and paired rows.'
  );
  const variants: ComponentNode[] = [];
  for (const v of COMPONENT_CATALOG.Button.Variant) {
    for (const s of COMPONENT_CATALOG.Button.State) variants.push(buttonVariant(v, s));
  }
  const set = variantSet('Button', variants, content, {
    columns: 4,
    description:
      'ui/Button.tsx · py-3.5 px-4, rounded-xl (16px) except link, text-base label. primary: bg-accent-primary + white semibold; secondary: bg-raised + accent semibold; outline: 1px accent border + accent label; ghost: accent label; link: text-link semibold, no radius; destructive: text-icon-danger medium. Pressed 0.8 opacity, disabled/loading 0.5, loading replaces the label with a spinner.',
  });
  addIconToggle(set);

  const guide = frame({ name: 'Variant guide', dir: 'H', gap: 24, wrap: true });
  add(content, guide, { h: 'FILL' });
  for (const v of COMPONENT_CATALOG.Button.Variant) add(guide, caption(v, BUTTON_LOOK[v].spec, 160));

  const row = usageRow(content, 'Footer pairs split the width (flex-1 each); the primary action sits on the right. Destructive actions are a transparent red label at the bottom of a detail screen.');

  const pair = demoColumn('Paired actions');
  const pairRow = frame({ name: 'Row', dir: 'H', gap: 12 });
  add(pair, pairRow, { h: 'FILL' });
  add(pairRow, instance('Button', { Variant: 'Secondary', State: 'Default', Label: 'Cancel' }), { h: 'FILL' });
  add(pairRow, instance('Button', { Variant: 'Primary', State: 'Default', Label: 'Save meal' }), { h: 'FILL' });
  add(row, specimen(pair, 'Paired footer actions', 'Secondary "Cancel" + Primary "Save meal", Fill each'));

  const withIcon = demoColumn('Icon and loading');
  const addFood = instance('Button', { Variant: 'Primary', State: 'Default', Label: 'Add food' });
  setBool(addFood, 'Show icon', true);
  add(withIcon, addFood, { h: 'FILL' });
  add(withIcon, instance('Button', { Variant: 'Primary', State: 'Loading', Label: 'Import history' }), { h: 'FILL' });
  add(row, specimen(withIcon, 'Leading icon, then loading', 'Show icon = on (white glyph); Loading keeps the width'));

  const detail = demoColumn('Detail screen actions', COLUMN, 4);
  add(detail, instance('Button', { Variant: 'Outline', State: 'Default', Label: 'Edit food' }), { h: 'FILL' });
  add(detail, instance('Button', { Variant: 'Destructive', State: 'Default', Label: 'Delete food' }), { h: 'FILL' });
  add(row, specimen(detail, 'Bottom of a detail screen', 'Outline "Edit food", Destructive "Delete food"'));

  const themes = section(
    body,
    'Themes',
    'The same instances inside frames rendered in Light, Dark and AMOLED. Only token values change; white labels stay white on the accent fill.',
    'H',
    24,
    true
  );
  const modes: [ThemeName, string][] = [
    ['light', 'Light'],
    ['dark', 'Dark'],
    ['amoled', 'AMOLED'],
  ];
  const labels: Record<ButtonVariant, string> = {
    Primary: 'Log food',
    Secondary: 'Scan barcode',
    Outline: 'Copy yesterday',
    Ghost: 'Edit goals',
    Link: 'Learn more',
    Destructive: 'Delete entry',
  };
  for (const [mode, name] of modes) {
    const f = frame({ name: `${name} theme`, dir: 'V', gap: 8, pad: 24, fill: 'background', radius: 16, width: 280 });
    setFrameTheme(f, mode);
    add(themes, f);
    add(f, text(name.toUpperCase(), { role: 'Overline/Default', color: 'text-muted' }));
    for (const v of COMPONENT_CATALOG.Button.Variant) {
      add(f, instance('Button', { Variant: v, State: 'Default', Label: labels[v] }), { h: 'FILL' });
    }
  }
  return root;
}

// ---------------------------------------------------------------- Inputs

function textFieldVariant(s: TextFieldState): ComponentNode {
  return component(`State=${s}`, { dir: 'V', gap: 6, width: FIELD_W }, (c) => {
    add(c, text('Food name', { role: 'Body/Field label', color: 'text-secondary', name: 'Label' }), { h: 'FILL' });
    const field = frame({
      name: 'Field',
      dir: 'H',
      gap: 1,
      pad: { x: 13, y: 11 },
      cross: 'CENTER',
      fill: 'raised',
      stroke: s === 'Focused' ? 'accent-primary' : 'border-subtle',
      radius: 12,
    });
    add(c, field, { h: 'FILL' });
    // In Empty the Value property renders as the placeholder, in Muted Slate.
    const value = text('Chicken breast', { role: 'Body/Input', color: s === 'Empty' ? 'text-muted' : 'text-primary', name: 'Value' });
    if (s === 'Focused') {
      add(field, value);
      add(field, caret());
    } else {
      add(field, value, { h: 'FILL' });
    }
    if (s === 'Error') {
      add(c, text('A food with this name already exists', { role: 'Body/Default', color: 'icon-danger', name: 'Helper' }), { h: 'FILL' });
    }
  });
}

function searchVariant(s: SearchState): ComponentNode {
  return component(
    `State=${s}`,
    {
      dir: 'H',
      gap: 8,
      pad: { x: 13, y: 11 },
      cross: 'CENTER',
      fill: 'raised',
      // LibrarySearchBar: transparent border at rest (still 1pt in layout), Sparky Blue on focus.
      stroke: s === 'Rest' ? undefined : 'accent-primary',
      radius: 12,
      width: FIELD_W,
    },
    (c) => {
      add(c, icon('search', 18, 'text-muted'));
      const input = frame({ name: 'Input', dir: 'H', gap: 1, cross: 'CENTER' });
      add(c, input, { h: 'FILL' });
      if (s === 'Typing') {
        add(input, text('chicken', { role: 'Body/Input', name: 'Query' }));
        add(input, caret());
        add(c, glyph('close', 16, 'text-muted', 'Clear'));
        return;
      }
      if (s === 'Focused') add(input, caret());
      add(input, text('Search foods', { role: 'Body/Input', color: 'text-muted', name: 'Placeholder' }));
    }
  );
}

const STEPPER_METRICS: Record<StepperSize, { cell: number; input: number; icon: number; font: number }> = {
  Default: { cell: 40, input: 56, icon: 20, font: 20 },
  Compact: { cell: 32, input: 48, icon: 18, font: 16 },
};

function stepperVariant(size: StepperSize): ComponentNode {
  const m = STEPPER_METRICS[size];
  return component(
    `Size=${size}`,
    { dir: 'H', pad: 1, cross: 'CENTER', fill: 'raised', stroke: 'border-subtle', radius: 12, clip: true },
    (c) => {
      const dec = frame({ name: 'Decrement', dir: 'H', align: 'CENTER', cross: 'CENTER', width: m.cell, height: m.cell, stroke: 'border-subtle', strokeSides: { r: 1 } });
      add(dec, glyph('remove', m.icon, 'accent-primary', 'Minus'));
      add(c, dec);
      const field = frame({ name: 'Input', dir: 'H', align: 'CENTER', cross: 'CENTER', width: m.input, height: m.cell });
      add(field, text('3', { size: m.font, lineHeight: m.font + 2, weight: 'Regular', align: 'CENTER', name: 'Value' }));
      add(c, field);
      const inc = frame({ name: 'Increment', dir: 'H', align: 'CENTER', cross: 'CENTER', width: m.cell, height: m.cell, stroke: 'border-subtle', strokeSides: { l: 1 } });
      add(inc, glyph('add', m.icon, 'accent-primary', 'Plus'));
      add(c, inc);
    }
  );
}

function pickerVariant(s: PickerState): ComponentNode {
  return component(
    `State=${s}`,
    {
      dir: 'H',
      gap: 8,
      pad: { x: 13, y: 11 },
      align: 'SPACE_BETWEEN',
      cross: 'CENTER',
      fill: 'raised',
      stroke: 'border-subtle',
      radius: 12,
      width: FIELD_W,
      opacity: s === 'Pressed' ? 0.7 : 1,
    },
    (c) => {
      add(c, text('Breakfast', { size: 16, lineHeight: 24, weight: 'Regular', name: 'Value' }), { h: 'FILL' });
      add(c, icon('chevron-down', 16, 'text-muted'));
    }
  );
}

function buildInputs(): FrameNode {
  const { root, body } = board(
    'Inputs',
    'Fields share Bright Control Fill (raised), 12px corners and a 1px border that turns Sparky Blue on focus. Focus is the only styled state: there is no red error border and read-only fields are not dimmed. Errors are a 14px Danger Glyph line under the field; submit failures are an error toast.',
    BOARD_W
  );

  // Text Field
  const tf = section(
    body,
    'Text Field',
    'FormInput: 10px vertical and 12px horizontal padding plus the 1px border (about 42pt), 16px text, Muted Slate placeholder. The label sits above in 14px medium Slate Secondary (mb-1.5).'
  );
  variantSet(
    'Text Field',
    COMPONENT_CATALOG['Text Field'].State.map(textFieldVariant),
    tf,
    {
      columns: 2,
      description:
        'FormInput.tsx · bg raised, 1px border-subtle (accent-primary on focus), rounded-lg 12px, padding 10/12, 16/20 text, placeholder text-muted. Label: text-sm font-medium text-text-secondary. Error: text-sm text-icon-danger line under the field, no red border. In Empty, Value is shown as the placeholder.',
    }
  );
  const tfRow = usageRow(tf, 'A create-food form: fields stack with 16px gaps inside a card.');
  const form = demoCard('New food form', COLUMN, 16);
  add(form, instance('Text Field', { State: 'Filled', Label: 'Food name', Value: 'Greek yogurt, plain' }), { h: 'FILL' });
  add(form, instance('Text Field', { State: 'Focused', Label: 'Brand', Value: 'Fage' }), { h: 'FILL' });
  add(form, instance('Text Field', { State: 'Error', Label: 'Serving size (g)', Value: '0', Helper: 'Enter a number greater than 0' }), { h: 'FILL' });
  add(tfRow, specimen(form, 'Create food', 'Filled, Focused and Error instances'));
  const goal = demoCard('Calorie goal');
  add(goal, instance('Text Field', { State: 'Empty', Label: 'Daily calorie goal', Value: 'e.g. 2,200' }), { h: 'FILL' });
  add(tfRow, specimen(goal, 'Empty with placeholder', 'Value doubles as the placeholder text'));

  // Search Field
  const sf = section(
    body,
    'Search Field',
    'LibrarySearchBar: flex-row bg-raised rounded-lg px-3 py-2.5, an 18px Muted Slate search glyph and a 16px input. The border is transparent at rest and Sparky Blue on focus. Exercise and preset search add a trailing 16px clear button while there is text.'
  );
  variantSet('Search Field', COMPONENT_CATALOG['Search Field'].State.map(searchVariant), sf, {
    columns: 3,
    description:
      'LibrarySearchBar.tsx · bg raised, rounded-lg 12px, px-3 py-2.5, 1px border transparent → accent-primary on focus, 18px search glyph text-muted, 16px input, gap 8. Typing shows the trailing 16px muted clear button used by exercise and preset search.',
  });
  const sfRow = usageRow(sf, 'Library lists put the field in a px-4 pb-3 strip under the header.');
  const strip = frame({ name: 'Library search strip', dir: 'V', pad: { x: 16, t: 8, b: 12 }, fill: 'background', width: 375 });
  add(strip, instance('Search Field', { State: 'Rest', Placeholder: 'Search exercises' }), { h: 'FILL' });
  add(sfRow, specimen(strip, 'Exercise library', 'Rest, Placeholder "Search exercises"'));
  const typing = frame({ name: 'Search typing', dir: 'V', pad: { x: 16, t: 8, b: 12 }, fill: 'background', width: 375 });
  add(typing, instance('Search Field', { State: 'Typing' }), { h: 'FILL' });
  add(sfRow, specimen(typing, 'Searching foods', 'Typing, with the clear button'));

  // Stepper
  const st = section(
    body,
    'Stepper',
    'StepperInput: a joined [−][value][+] control on bg-raised with 12px corners, a 1px border and inner dividers in the same color (Sparky Blue while the value is focused). The − and + glyphs are Sparky Blue.'
  );
  variantSet('Stepper', COMPONENT_CATALOG.Stepper.Size.map(stepperVariant), st, {
    columns: 2,
    description:
      'StepperInput.tsx · bg raised, rounded-lg 12px, 1px border-subtle with matching inner dividers (accent-primary when focused). Default: 40×40 cells, 56px value, 20px icons and text. Compact (set rows): 32×32 cells, 48px value, 18px icons, 16px text.',
  });
  const stRow = usageRow(st, 'Compact steppers sit side by side in workout set rows; the default size is used for servings and goals.');
  const setRow = demoCard('Set row', COLUMN, 0, { x: 16, y: 12 });
  const setLine = frame({ name: 'Set 1', dir: 'H', gap: 12, cross: 'CENTER' });
  add(setRow, setLine, { h: 'FILL' });
  add(setLine, text('1', { role: 'Row/Title', color: 'text-muted', width: 20 }));
  for (const [value, unit] of [
    ['60', 'kg'],
    ['8', 'reps'],
  ] as const) {
    const cell = frame({ name: unit, dir: 'V', gap: 4, cross: 'CENTER' });
    add(setLine, cell);
    add(cell, instance('Stepper', { Size: 'Compact', Value: value }));
    add(cell, text(unit, { role: 'Caption/Default', color: 'text-muted' }));
  }
  add(stRow, specimen(setRow, 'Workout set row', 'Compact: 60 kg × 8 reps'));
  const servings = demoCard('Servings');
  const servingsLine = frame({ name: 'Servings row', dir: 'H', gap: 12, cross: 'CENTER', align: 'SPACE_BETWEEN' });
  add(servings, servingsLine, { h: 'FILL' });
  add(servingsLine, text('Servings', { role: 'Row/Title' }));
  add(servingsLine, instance('Stepper', { Size: 'Default', Value: '2' }));
  add(stRow, specimen(servings, 'Servings', 'Default size, Value "2"'));

  // Picker Trigger
  const pk = section(
    body,
    'Picker Trigger',
    'PickerTrigger (BottomSheetPicker): px-3 py-2.5 rounded-lg border border-border-subtle bg-raised min-h-11, the value in 16px Ink Navy and a 16px muted down-chevron. Tapping opens a picker sheet; pressed dims to 70%.'
  );
  variantSet('Picker Trigger', COMPONENT_CATALOG['Picker Trigger'].State.map(pickerVariant), pk, {
    columns: 2,
    description:
      'BottomSheetPicker.tsx PickerTrigger · flex-row justify-between, px-3 py-2.5, rounded-lg 12px, 1px border-subtle, bg raised, min-h-11 (44pt), value text-base text-text-primary, 16px chevron-down text-muted. Pressed: activeOpacity 0.7.',
  });
  const pkRow = usageRow(pk, 'Pickers stack under a field label like text fields do.');
  const logForm = demoCard('Log food', COLUMN, 16);
  labelled(logForm, 'Meal', instance('Picker Trigger', { State: 'Default', Value: 'Lunch' }));
  labelled(logForm, 'Serving unit', instance('Picker Trigger', { State: 'Default', Value: 'cup (245 g)' }));
  add(pkRow, specimen(logForm, 'Log food sheet', 'Meal and serving unit pickers'));

  return root;
}

// ---------------------------------------------------------------- Selection controls

const SEGMENT_LABELS = ['Day', 'Week', 'Month'] as const;
const SEGMENT_COMBOS: [SegmentCount, SegmentIndex][] = [
  ['2', '1'],
  ['2', '2'],
  ['3', '1'],
  ['3', '2'],
  ['3', '3'],
];

function segmentedVariant(count: SegmentCount, selected: SegmentIndex): ComponentNode {
  return component(`Segments=${count}, Selected=${selected}`, { dir: 'H', pad: 4, fill: 'raised', radius: 12, width: FIELD_W }, (c) => {
    const n = Number(count);
    for (let i = 1; i <= n; i++) {
      const on = String(i) === selected;
      const cell = frame({ name: `Cell ${i}`, dir: 'H', gap: 6, pad: { y: 8 }, align: 'CENTER', cross: 'CENTER', radius: 8, fill: on ? 'surface' : null });
      add(c, cell, { h: 'FILL' });
      add(cell, text(SEGMENT_LABELS[i - 1], { role: 'Label/Segmented', color: on ? 'text-primary' : 'text-muted', name: `Segment ${i}` }));
    }
  });
}

function switchVariant(on: SwitchOn): ComponentNode {
  const isOn = on === 'true';
  return component(`On=${on}`, { width: 51, height: 31, fill: isOn ? 'form-enabled' : 'form-disabled', radius: 15.5 }, (c) => {
    const thumb = ellipse(27, null);
    thumb.name = 'Thumb';
    thumb.fills = [solid(WHITE)];
    effect(thumb, 'Elevation/Card (shadow-sm)');
    add(c, thumb, { absolute: { x: isOn ? 22 : 2, y: 2 } });
  });
}

const CHIP_LOOK: Record<ChipStyle, { fill: string; fillOpacity: number; stroke: string; ink: string | null }> = {
  'Selected solid': { fill: 'accent-primary', fillOpacity: 1, stroke: 'accent-primary', ink: null },
  'Selected tint': { fill: 'accent-primary', fillOpacity: 0.1, stroke: 'accent-primary', ink: 'accent-primary' },
  Unselected: { fill: 'raised', fillOpacity: 1, stroke: 'border-subtle', ink: 'text-primary' },
};

function chipVariant(style: ChipStyle): ComponentNode {
  const look = CHIP_LOOK[style];
  return component(
    `Style=${style}`,
    {
      dir: 'H',
      pad: { x: 13, y: 5 },
      align: 'CENTER',
      cross: 'CENTER',
      fill: look.fill,
      fillOpacity: look.fillOpacity,
      stroke: look.stroke,
      radius: PILL,
    },
    (c) => {
      add(c, inkText('Breakfast', look.ink, { size: 14, lineHeight: 20, weight: 'Medium', name: 'Label' }));
    }
  );
}

/** A hand-built settings-style row (title, subtitle, trailing switch) for the Switch example. */
function switchRow(parent: FrameNode, title: string, subtitle: string, on: SwitchOn): void {
  const row = frame({ name: title, dir: 'H', gap: 12, pad: { x: 16, y: 12 }, cross: 'CENTER' });
  add(parent, row, { h: 'FILL' });
  const col = frame({ name: 'Text', dir: 'V', gap: 2 });
  add(row, col, { h: 'FILL' });
  add(col, text(title, { role: 'Row/Title' }), { h: 'FILL' });
  add(col, text(subtitle, { role: 'Row/Subtitle', color: 'text-secondary' }), { h: 'FILL' });
  add(row, instance('Switch', { On: on }));
}

function buildSelection(): FrameNode {
  const { root, body } = board(
    'Selection controls',
    'Selection shows through Sparky Blue fills and borders on chips, a one-step-darker segment fill with an Ink Navy label in segmented controls, and the native switch, whose on track is a muted slate blue (Switch On), deliberately not the accent.',
    BOARD_W
  );

  // Segmented Control
  const sc = section(
    body,
    'Segmented Control',
    'Track flex-row bg-raised p-1 rounded-lg; segments flex-1 py-2 rounded-md. The selected segment is Porcelain Card (surface), one step darker than the track, so selection reads mainly through the label: 14px medium, Ink Navy when selected, Muted Slate otherwise.'
  );
  variantSet(
    'Segmented Control',
    SEGMENT_COMBOS.map(([n, s]) => segmentedVariant(n, s)),
    sc,
    {
      columns: 2,
      description:
        'SegmentedControl.tsx · track bg raised, p-1, rounded-lg 12px; segment flex-1 py-2 rounded-md 8px, selected bg surface; label text-sm font-medium, text-primary selected / text-muted otherwise. Valid combinations: Segments=2 with Selected 1–2, Segments=3 with Selected 1–3.',
    }
  );
  const scRow = usageRow(sc, 'Chart ranges and per-unit toggles; labels stay short so segments split evenly.');
  const chart = demoCard('Chart range');
  add(chart, text('Calories', { role: 'Title/Screen bar' }));
  add(chart, instance('Segmented Control', { Segments: '3', Selected: '2', 'Segment 1': '7 days', 'Segment 2': '30 days', 'Segment 3': '90 days' }), { h: 'FILL' });
  add(scRow, specimen(chart, 'Trend range', 'Segments=3, Selected=2'));
  const per = demoCard('Nutrition basis');
  add(per, instance('Segmented Control', { Segments: '2', Selected: '1', 'Segment 1': 'Per serving', 'Segment 2': 'Per 100 g' }), { h: 'FILL' });
  add(scRow, specimen(per, 'Nutrition basis', 'Segments=2, Selected=1'));

  // Switch
  const sw = section(
    body,
    'Switch',
    'ui/Switch wraps the native switch with a white thumb. The track is Switch On Track (form-enabled) when on and Switch Off Track (form-disabled) when off; on iOS the off color only tints the outline. New toggles go in a SettingsRow trailing slot.'
  );
  variantSet('Switch', COMPONENT_CATALOG.Switch.On.map(switchVariant), sw, {
    columns: 2,
    description:
      'ui/Switch.tsx · native switch, 51×31 iOS metrics. Track: --color-form-enabled (on) / --color-form-disabled (off). Thumb: fixed #FFFFFF.',
  });
  const swRow = usageRow(sw, 'Trailing switch in grouped settings rows.');
  const settings = demoCard('Sync settings', COLUMN, 0, 0);
  switchRow(settings, 'Sync Apple Health', 'Steps, workouts and weight', 'true');
  add(settings, divider(COLUMN, 'border-subtle'), { h: 'FILL' });
  switchRow(settings, 'Show net calories', 'Subtract exercise from intake', 'false');
  add(swRow, specimen(settings, 'Settings rows', 'On=true and On=false'));

  // Chip
  const ch = section(
    body,
    'Chip',
    'Selectable chips (canonical: HydrationGauge container chips): a pill with a 1px border, px-3 py-1 and a 14px medium label. Selected is the solid accent with a white label, or the tint (accent at 10% with an accent border and label). Unselected is bg-raised with a Hairline Divider border and an Ink Navy label.'
  );
  variantSet('Chip', COMPONENT_CATALOG.Chip.Style.map(chipVariant), ch, {
    columns: 3,
    description:
      'Selectable chip · rounded-full, 1px border, px-3 py-1, text-sm font-medium. Selected solid: bg-accent-primary border-accent-primary text-white. Selected tint: bg-accent-primary/10 border-accent-primary text-accent-primary. Unselected: bg-raised border-border-subtle text-text-primary.',
  });
  const chRow = usageRow(ch, 'Single choice uses the solid style; filters use the tint.');
  const containers = demoCard('Container chips');
  add(containers, text('Container', { role: 'Body/Field label', color: 'text-secondary' }));
  const chips = frame({ name: 'Chips', dir: 'H', gap: 8, wrap: true });
  add(containers, chips, { h: 'FILL' });
  add(chips, instance('Chip', { Style: 'Selected solid', Label: 'Glass 250 ml' }));
  add(chips, instance('Chip', { Style: 'Unselected', Label: 'Bottle 500 ml' }));
  add(chips, instance('Chip', { Style: 'Unselected', Label: 'Mug 350 ml' }));
  add(chRow, specimen(containers, 'Water container', 'Selected solid + Unselected'));
  const filters = demoColumn('Filter chips');
  const filterRow = frame({ name: 'Chips', dir: 'H', gap: 8, wrap: true });
  add(filters, filterRow, { h: 'FILL' });
  add(filterRow, instance('Chip', { Style: 'Selected tint', Label: 'All' }));
  add(filterRow, instance('Chip', { Style: 'Unselected', Label: 'Favorites' }));
  add(filterRow, instance('Chip', { Style: 'Unselected', Label: 'Recent' }));
  add(filterRow, instance('Chip', { Style: 'Unselected', Label: 'Custom' }));
  add(chRow, specimen(filters, 'Library filters', 'Selected tint + Unselected'));

  return root;
}

// ---------------------------------------------------------------- Chips & badges

function allergenVariant(strength: AllergenStrength): ComponentNode {
  const contains = strength === 'Contains';
  return component(
    `Strength=${strength}`,
    { dir: 'H', gap: 4, pad: { x: 8, y: 2 }, cross: 'CENTER', fill: 'bg-danger-subtle', radius: PILL },
    (c) => {
      const weight: Weight = contains ? 'Semi Bold' : 'Regular';
      if (contains) {
        add(c, icon('warning', 12, 'text-danger-subtle'));
      } else {
        add(c, text('Trace:', { size: 12, lineHeight: 16, weight, color: 'text-danger-subtle', name: 'Prefix' }));
      }
      add(c, text('Peanuts', { size: 12, lineHeight: 16, weight, color: 'text-danger-subtle', name: 'Label' }));
    }
  );
}

function buildChipsBadges(): FrameNode {
  const { root, body } = board(
    'Chips & badges',
    'Read-only pills and badges. Status pills pair a wash with its ink (bg-warning + text-warning, bg-danger-subtle + text-danger-subtle). Pills are fully round; small rectangular tag badges use 8px corners.',
    BOARD_W
  );

  // Meal Calorie Chip
  const mc = section(
    body,
    'Meal Calorie Chip',
    'Diary meal-card header chip: bg-accent-primary/5 rounded-full px-2.5 py-0.5 with a 12px semibold Sparky Blue label, "eaten / target Cal" (just "eaten Cal" when the meal has no target).'
  );
  const mealChip = component('Meal Calorie Chip', { dir: 'H', pad: { x: 10, y: 2 }, cross: 'CENTER', fill: 'accent-primary', fillOpacity: 0.05, radius: PILL }, (c) => {
    add(c, text('420 / 600 Cal', { size: 12, lineHeight: 16, weight: 'Semi Bold', color: 'accent-primary', name: 'Label' }));
  });
  single('Meal Calorie Chip', mealChip, mc, 'FoodSummary.tsx · bg-accent-primary/5 rounded-full px-2.5 py-0.5, text-xs font-semibold text-accent-primary.');
  const mcRow = usageRow(mc, 'Sits between the meal title and the chevron in the meal card header (flex-row gap-2).');
  for (const [mealIcon, meal, label] of [
    ['meal-breakfast', 'Breakfast', '420 / 600 Cal'],
    ['meal-snack', 'Snacks', '180 Cal'],
  ] as const) {
    const cardFrame = demoCard(`${meal} card`);
    const header = frame({ name: 'Meal header', dir: 'H', gap: 8, cross: 'CENTER' });
    add(cardFrame, header, { h: 'FILL' });
    add(header, glyph(mealIcon, 18, 'accent-primary', 'Meal icon'));
    add(header, text(meal, { role: 'Card/Diary title', color: 'text-secondary' }), { h: 'FILL' });
    add(header, instance('Meal Calorie Chip', { Label: label }));
    add(header, glyph('chevron-forward', 14, 'accent-primary', 'Chevron'));
    add(mcRow, specimen(cardFrame, `${meal} header`, label.includes('/') ? 'Eaten / target' : 'No meal target set'));
  }

  // AI Estimate Pill
  const ai = section(
    body,
    'AI Estimate Pill',
    'Marks a food whose nutrition came from an AI estimate: px-1.5 py-0.5 rounded-full bg-bg-warning with a 10px semibold Warning Ink label.'
  );
  const aiPill = component('AI Estimate Pill', { dir: 'H', pad: { x: 6, y: 2 }, cross: 'CENTER', fill: 'bg-warning', radius: PILL }, (c) => {
    add(c, text('AI estimate', { size: 10, lineHeight: 14, weight: 'Semi Bold', color: 'text-warning', name: 'Label' }));
  });
  single('AI Estimate Pill', aiPill, ai, 'AiEstimateBadge.tsx · px-1.5 py-0.5 rounded-full bg-bg-warning, text-[10px] font-semibold text-text-warning.');
  const aiRow = usageRow(ai, 'Next to the food name in library and photo-review rows.');
  const foodRow = demoCard('Library food row', COLUMN, 2, { x: 16, y: 12 });
  const nameLine = frame({ name: 'Name line', dir: 'H', gap: 6, cross: 'CENTER' });
  add(foodRow, nameLine, { h: 'FILL' });
  add(nameLine, text('Chicken tikka masala', { role: 'Row/Title' }));
  add(nameLine, instance('AI Estimate Pill'));
  add(foodRow, text('1 plate (350 g) · 640 Cal', { role: 'Row/Subtitle', color: 'text-secondary' }));
  add(aiRow, specimen(foodRow, 'Photo-logged food', 'Default label "AI estimate"'));

  // Allergen Chip
  const al = section(
    body,
    'Allergen Chip',
    'AllergenBadges: bg-bg-danger-subtle rounded-full px-2 py-0.5 with a 12px Danger Ink label. Contains is semibold and prefixed with a warning sign; Trace is regular weight and reads "Trace: name". Only allergens the user tracks are shown.'
  );
  variantSet('Allergen Chip', COMPONENT_CATALOG['Allergen Chip'].Strength.map(allergenVariant), al, {
    columns: 2,
    description:
      'AllergenBadges.tsx · bg-bg-danger-subtle rounded-full px-2 py-0.5, text-xs text-text-danger-subtle, capitalized. Contains: font-semibold with a warning sign. Trace: regular, "Trace:" prefix.',
  });
  const alRow = usageRow(al, 'Wrapping row (flex-wrap gap-1 mt-1) under the food name.');
  const allergenFood = demoCard('Food with allergens', COLUMN, 4, { x: 16, y: 12 });
  add(allergenFood, text('Peanut butter protein bar', { role: 'Row/Title' }));
  add(allergenFood, text('1 bar (60 g) · 230 Cal', { role: 'Row/Subtitle', color: 'text-secondary' }));
  const allergenChips = frame({ name: 'Allergens', dir: 'H', gap: 4, wrap: true });
  add(allergenFood, allergenChips, { h: 'FILL' });
  add(allergenChips, instance('Allergen Chip', { Strength: 'Contains', Label: 'Peanuts' }));
  add(allergenChips, instance('Allergen Chip', { Strength: 'Contains', Label: 'Milk' }));
  add(allergenChips, instance('Allergen Chip', { Strength: 'Trace', Label: 'Soy' }));
  add(alRow, specimen(allergenFood, 'Food row', 'Contains Peanuts, Milk; Trace Soy'));

  // Tag Badge
  const tb = section(
    body,
    'Tag Badge',
    'Small rectangular tag: px-2 py-0.5 rounded-md (8px) on an accent tint with a 12px bold, uppercase, wide-tracked Sparky Blue label (guided-workout and WOD badges).'
  );
  const tag = component('Tag Badge', { dir: 'H', pad: { x: 8, y: 2 }, cross: 'CENTER', fill: 'accent-primary', fillOpacity: 0.1, radius: 8 }, (c) => {
    add(c, text('Guided', { size: 12, lineHeight: 16, weight: 'Bold', color: 'accent-primary', uppercase: true, letterSpacingPercent: 2.5, name: 'Label' }));
  });
  single('Tag Badge', tag, tb, 'ActiveWorkoutGuidedCard / WorkoutCompleteWodCard · bg-accent-primary/10 (to /15) px-2 py-0.5 rounded-md, text-xs font-bold text-accent-primary tracking-wide uppercase.');
  const tbRow = usageRow(tb, 'Leads a card header row, followed by a short muted or secondary title.');
  const guided = demoCard('Guided workout card');
  const guidedLine = frame({ name: 'Header', dir: 'H', gap: 8, cross: 'CENTER' });
  add(guided, guidedLine, { h: 'FILL' });
  add(guidedLine, instance('Tag Badge', { Label: 'Guided' }));
  add(guidedLine, text('Upper body strength · 6 intervals', { role: 'Body/Field label', color: 'text-secondary' }), { h: 'FILL' });
  add(tbRow, specimen(guided, 'Guided workout', 'Label "Guided"'));
  const wod = demoCard('WOD card');
  const wodLine = frame({ name: 'Header', dir: 'H', gap: 6, cross: 'CENTER' });
  add(wod, wodLine, { h: 'FILL' });
  add(wodLine, instance('Tag Badge', { Label: 'AMRAP' }));
  add(wodLine, text('WOD score', { size: 12, lineHeight: 16, weight: 'Semi Bold', color: 'text-muted', uppercase: true }));
  add(tbRow, specimen(wod, 'Workout complete', 'Label "AMRAP"'));

  return root;
}

// ---------------------------------------------------------------- entry

/** Builds the Buttons, Inputs, Selection controls and Chips & badges boards and their components. */
export function buildControls(): FrameNode[] {
  return [buildButtons(), buildInputs(), buildSelection(), buildChipsBadges()];
}
