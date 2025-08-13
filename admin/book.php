<?php
include 'admin/db.php';

// Preluăm doar sloturile disponibile
$slots = $pdo->query("SELECT * FROM available_slots WHERE status = 'available' ORDER BY date, hour")->fetchAll();
?>

<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>Rezervă o consultație</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f2f2f2;
      padding: 30px;
    }
    form {
      background: #fff;
      padding: 25px;
      border-radius: 8px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    label {
      display: block;
      margin-top: 15px;
      font-weight: bold;
    }
    input, select, textarea {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
    }
    button {
      margin-top: 20px;
      padding: 12px;
      background-color: #cb8645;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #a25b2a;
    }
  </style>
</head>
<body>

<h2 style="text-align:center;">🍼 Rezervare consultație alăptare</h2>

<form action="admin/process_booking.php" method="POST">
  <label for="name">Nume complet:</label>
  <input type="text" name="name" required>

  <label for="email">Adresă email:</label>
  <input type="email" name="email" required>

  <label for="phone">Telefon:</label>
  <input type="text" name="phone" required>

  <label for="consult_type">Tip consultație:</label>
  <select name="consult_type" required>
    <option value="">Alege...</option>
    <option value="online">Online</option>
    <option value="fizic">Fizic (față în față)</option>
  </select>

  <label for="date">Data:</label>
  <select name="date" required>
    <option value="">Alege o dată...</option>
    <?php
    $dates = [];
    foreach ($slots as $slot) {
      if (!in_array($slot['date'], $dates)) {
        echo "<option value='{$slot['date']}'>{$slot['date']}</option>";
        $dates[] = $slot['date'];
      }
    }
    ?>
  </select>

  <label for="hour">Ora:</label>
  <select name="hour" required>
    <option value="">Alege o oră...</option>
    <?php foreach ($slots as $slot): ?>
      <option value="<?= $slot['hour'] ?>"><?= $slot['date'] ?> - <?= substr($slot['hour'], 0, 5) ?></option>
    <?php endforeach; ?>
  </select>

  <label for="payment_method">Metodă de plată:</label>
  <select name="payment_method" required>
    <option value="">Alege...</option>
    <option value="cash">Cash</option>
    <option value="card">Card</option>
  </select>

  <label for="notes">Note opționale:</label>
  <textarea name="notes" rows="4" placeholder="Detalii adiționale..."></textarea>

  <button type="submit">📩 Trimite rezervarea</button>
</form>

</body>
</html>
