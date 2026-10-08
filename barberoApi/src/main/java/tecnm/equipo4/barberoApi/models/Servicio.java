package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "servicio")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idServicio")
    private Long idServicio;

    @Column(name = "nombreServicio", nullable = false)
    private String nombreServicio;

    @Column(name = "duracion")
    private Integer duracion; // En minutos

    @Column(name = "precio", precision = 10, scale = 2)
    private BigDecimal precio;

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();


}