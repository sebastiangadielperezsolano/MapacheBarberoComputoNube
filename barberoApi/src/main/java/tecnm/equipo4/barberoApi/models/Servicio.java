package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "servicio")
public class Servicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idServicio")
    private Long idServicio;

    @NotNull
    @Column(name = "nombreServicio")
    private String nombreServicio;

    @NotNull
    @Column(name = "duracion")
    private Integer duracion; // En minutos

    @NotNull
    @Column(name = "precio")
    @Digits(integer = 6, fraction = 2)
    private BigDecimal precio;

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();
}