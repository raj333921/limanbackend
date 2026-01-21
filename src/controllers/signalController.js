const pool = require("../config/db");
const upload = require("../utils/multerConfig");
/**
 * CREATE Signal Signs (Admin)
 */
exports.createSignalSigns = async (req, res) => {
const { type, explanation} = req.body;
  let image_path = req.file ? req.file.path : null;
  try {
    await pool.query(
      `INSERT INTO signal_signs ( image_path, type, explanation) VALUES ($1,$2,$3)`,
      [ image_path, level,explanation]
    );
    res.json({ message: "Signal signs added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * READ all activation codes (Admin)
 */
exports.getSignalSigns = async (req, res) => {
  const { lang = "en" } = req.query;
    try {
      const easyQuery = await pool.query(
        `SELECT id, (explanation->0->>$1) AS explanation, type ,image_path
         FROM signal_signs`,
        [lang]
      );
      const allQuestions = [...easyQuery.rows].map(q => {
          // Convert image to base64
          let image_base64 = null;
          if (q.image_path) {
              try {
                  const imageFullPath = path.join(__dirname, "../..", q.image_path);
                  if (fs.existsSync(imageFullPath)) {
                      const fileBuffer = fs.readFileSync(imageFullPath);
                      const ext = q.image_path.split(".").pop().toLowerCase();
                      image_base64 = `data:image/${ext};base64,${fileBuffer.toString("base64")}`;
                  }
              } catch (err) {
                  console.error("Base64 conversion error:", err);
              }
          }

          return {
              ...q,
              image_base64
          };
      });
      res.json(allQuestions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

/**
 * UPDATE activation code (Admin)
 * Example: mark used / update email
 */
exports.updateSignalSigns = async (req, res) => {
  const { id } = req.params;
  const { type, explanation} = req.body;

    try {
      // Get the old image path
      const oldResult = await pool.query(`SELECT image_path FROM signal_signs WHERE id=$1`, [id]);
      const oldImage = oldResult.rows[0]?.image_path;
      // New image path
      const newImage = req.file ? req.file.path : oldImage;
      await pool.query(
        `UPDATE signal_signs SET image_path=$1, type=$2, explanation=$3  WHERE id=$4`,
        [newImage, type,explanation, id]
      );
      // Delete old image if replaced
      if (req.file && oldImage && fs.existsSync(oldImage)) {
        fs.unlinkSync(oldImage);
      }
      res.json({ message: "Signal signs updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

/**
 * DELETE activation code (Admin)
 */
exports.deleteSignalSigns = async (req, res) => {
  const { level, id } = req.params;

    try {
      // Get the image path
      const result = await pool.query(`SELECT image_path FROM signal_signs WHERE id=$1`, [id]);
      const imagePath = result.rows[0]?.image_path;

      // Delete from DB
      await pool.query(`DELETE FROM signal_signs WHERE id=$1`, [id]);

      // Delete the file
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ message: "Signal signs deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};


exports.getSignalSignsById = async (req, res) => {
  const { id } = req.params;
      try {
          const result = await pool.query(
              `SELECT *, image_path FROM signal_signs WHERE id = $1,
              [id]
          );
          if (result.rows.length === 0)
              return res.status(404).json({ message: "Not found" });

          const signalSigns = result.rows[0];

          if (signalSigns.image_path) {
              // Use process.cwd() to get the current working directory of the Node process
              const imageFullPath = path.join(process.cwd(), signalSigns.image_path);
              if (fs.existsSync(imageFullPath)) {
                  const imageData = fs.readFileSync(imageFullPath);
                  signalSigns.image_base64 = `data:image/jpeg;base64,${imageData.toString("base64")}`;
              } else {
                  console.warn("Image not found:", imageFullPath);
                  signalSigns.image_base64 = null;
              }
          }
          res.json(signalSigns);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
      }
};
