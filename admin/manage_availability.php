<?php
// manage_availability.php – pagina unde adminul adaugă ore disponibile
session_start();

// Protecție simplă pentru acces admin
if (!isset($_SESSION['admin_logged_in'])) {
  header('Location: admin_login.php');
  exit;
}

include 'db.php';

// Adăugare slot disponibil
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $date = $_POST['date'];
  $hour = $_POST['hour'];

  // Verificare dubluri
  $check = $pdo->prepare("SELECT * FROM available_slots WHERE date = ? AND hour = ?");
  $check->execute([$date, $hour]);

  if ($check->rowCount() === 0) {
    $stmt = $pdo->prepare("INSERT INTO available_slots (date, hour, status) VALUES (?, ?, 'available')");
    $stmt->execute([$date, $hour]);
  } else {
    $message = "Slotul există deja.";
  }
}

// Preluare sloturi existente
$slots = $pdo->query("SELECT * FROM available_slots ORDER BY date, hour")->fetchAll();
?>

<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>Administrare Sloturi Disponibile</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Adaugă Slot Disponibil</h1>
  <?php if (isset($message)) echo "<p style='color:red;'>$message</p>"; ?>
  <form method="POST">
    <label>Data:</label>
    <input type="date" name="date" required>
    <label>Ora:</label>
    <input type="time" name="hour" required>
    <button type="submit">Adaugă</button>
  </form>

  <h2>Sloturi existente</h2>
  <table border="1" cellpadding="8">
    <thead>
      <tr>
        <th>Data</th>
        <th>Ora</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($slots as $slot): ?>
        <tr>
          <td><?= htmlspecialchars($slot['date']) ?></td>
          <td><?= htmlspecialchars($slot['hour']) ?></td>
          <td><?= htmlspecialchars($slot['status']) ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</body>
</html>
