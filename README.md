# LetterboxdRecentLogs.tsx

A simple Letterboxd styled React component that displays a user's recently watched films from Letterboxd using their public RSS feed.

<div align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/3df55a2c-45b7-44d1-9271-98a29048ca7c" alt="screenshot" width="512">
  <br>
</div>

## Installation

Simply copy the `LetterboxdRecentLogs` directory into your project.

## Usage
Import the component and use it inside your React application as:

```tsx
import LetterboxdRecentLogs from './components/LetterboxdRecentLogs';

function App() {
  return (
    <div className="App">
      <LetterboxdRecentLogs 
        username="berkaayildiz" 
        count={4}
      />
    </div>
  );
}
```

> [!IMPORTANT]
> Letterboxd's RSS feed has CORS restrictions. Use a proxy for production environments.

## Props
This component accepts the following props:


| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | string | Required | Letterboxd username |
| `count` | number | 4 | Number of films to display |

## License
This project is open-source and available under the [MIT License](LICENSE). Contributions are welcome.