package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "servicio")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Long idServicio;

    @Column(name = "nombre_servicio", nullable = false)
    private String nombreServicio;

    @Column(name = "duracion")
    private Integer duracion;

    @Column(name = "precio")
    private BigDecimal precio;
}