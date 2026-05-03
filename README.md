# PCF-Controls — Action Button ("Send to DAS")

A PowerApps Component Framework (PCF) control that renders a customizable action button on model-driven app forms.

## Purpose

This control displays a **"Send to DAS"** button on a form. When clicked, it writes a value to the bound field (text or datetime), which triggers an onChange event where custom business logic can be executed (e.g., triggering a Power Automate flow to send an email).

## How It Works

1. The button is bound to a **text or datetime column** on your table
2. On click, it writes either the button label or a custom ID to that field
3. An **onChange event** on the bound field detects the value change and executes your logic
4. The field value is then cleared to allow subsequent clicks

## Setup

### Prerequisites
- Node.js and npm
- .NET SDK
- Power Platform CLI (`pac`)

### Build

```bash
cd ActionButton
npm install
npm run build
```

### Package as Solution

```bash
cd ActionButtonSolution
dotnet build /restore
```

The deployable solution zip will be generated at `ActionButtonSolution/bin/Debug/ActionButtonSolution.zip`.

### Deploy

1. Import `ActionButtonSolution.zip` into your Power Apps environment via **make.powerapps.com** > Solutions > Import
2. On your form, select a text or datetime field → Add control → **ActionButton**
3. Configure properties (see below)

## Configuration

|Parameter|Description|Required|Bound to an attribute|Additional info|
|---------|-----------|:----:|:---:|------|
|**Attribute**|The column to bind the control to|X|X||
|**ActionText**|Text of the action button||| Static string or JSON for multi-language: `{"1033":"Send to DAS","1036":"Envoyer à DAS"}`|
|**Button identifier**|An identifier of your choice for the button||||
|**Send Identifier**|Whether to send the identifier or the label when clicked||||
|**Always enable button**|Keep button enabled even when the form is disabled||||
|**Background color**|Background color (default state)||||
|**Border color**|Border color (default state)||||
|**Color**|Text color (default state)||||
|**Background color (hovered)**|Background color on hover||||
|**Border color (hovered)**|Border color on hover||||
|**Color (hovered)**|Text color on hover||||
|**Background color (pressed)**|Background color when pressed||||
|**Border color (pressed)**|Border color when pressed||||
|**Color (pressed)**|Text color when pressed||||
|**Icon**|Fluent UI icon name|||[Available icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons#available-icons)|
|**Tooltip**|Tooltip text shown on hover||||
|**Width**|Button width|||Pixel or percentage (e.g., `200px`, `100%`, `auto`)|

## Sample onChange Handler

```javascript
function onSendToDASChange(context) {
  var attribute = context.getEventSource();
  var value = attribute.getValue();

  if (value === "Send to DAS") {
    // Execute your business logic here
    // e.g., call a Power Automate flow, Custom API, etc.
  }

  // Clear the value and prevent submission
  attribute.setValue(null);
  attribute.setSubmitMode("never");
}
```

## Triggering an Email via Power Automate (Alternative)

Instead of JavaScript, you can use a Power Automate flow:

1. Create an **Automated cloud flow** with trigger: **When a row is modified** (Dataverse)
2. Set **Filter columns** to your bound field's schema name
3. Add a **Send an email** action with your desired recipients, subject, and body

## Credits

Based on the [ActionButton PCF control](https://github.com/MscrmTools/PCF-Controls) by MscrmTools.


