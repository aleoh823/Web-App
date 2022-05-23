-- Make the stuff table
CREATE TABLE  `technique` (
  `technique` VARCHAR(50) NOT NULL,
  `mastered` TINYINT NOT NULL,
  `progress_report` VARCHAR(1200) NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`));
